import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let envLoaded = false;
let cachedConfig = null;
const requestLog = new Map();

function loadEnvironment() {
  if (envLoaded) {
    return;
  }

  const rootDir = path.resolve(__dirname, "..");
  const baseEnvFiles = [path.join(rootDir, ".env"), path.join(__dirname, ".env")];
  const localEnvFiles = [path.join(rootDir, ".env.local"), path.join(__dirname, ".env.local")];

  for (const envPath of baseEnvFiles) {
    dotenv.config({ path: envPath });
  }
  for (const envPath of localEnvFiles) {
    dotenv.config({ path: envPath, override: true });
  }

  envLoaded = true;
}

loadEnvironment();

function getClientIp(headers, fallbackIp) {
  const forwarded = headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return fallbackIp || "unknown";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatLabel(key) {
  return key
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeValue(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean)
      .join(", ");
  }

  return String(value || "").trim();
}

function formatEmailValue(key, value) {
  const normalized = normalizeValue(value);

  if (key === "intake_completed" && normalized.toLowerCase() === "on") {
    return "Yes";
  }

  return normalized;
}

function isValidEmail(value) {
  if (typeof value !== "string") {
    return false;
  }
  const normalized = value.trim();
  if (!normalized) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
}

function getReplyToEmail(fields) {
  const replyToKeys = [
    "email",
    "client_email",
    "contact_email",
    "email_address",
    "best_email",
    "your_email",
  ];

  for (const key of replyToKeys) {
    const candidate = normalizeValue(fields?.[key]);
    if (isValidEmail(candidate)) {
      return candidate;
    }
  }

  return null;
}

function isRateLimited(ip, config) {
  const now = Date.now();
  const recent = (requestLog.get(ip) || []).filter(
    (timestamp) => now - timestamp < config.rateLimitWindowMs,
  );

  if (recent.length >= config.rateLimitMax) {
    requestLog.set(ip, recent);
    return true;
  }

  recent.push(now);
  requestLog.set(ip, recent);
  return false;
}

export function getApiConfig() {
  loadEnvironment();

  if (cachedConfig) {
    return cachedConfig;
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFromEmail = normalizeValue(process.env.RESEND_FROM_EMAIL);
  const contactToEmail = normalizeValue(process.env.CONTACT_TO_EMAIL);
  const rateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 600000);
  const rateLimitMax = Number(process.env.RATE_LIMIT_MAX || 5);
  const resend = resendApiKey ? new Resend(resendApiKey) : null;

  if (!resendApiKey) {
    console.warn(
      "Missing RESEND_API_KEY. Email sending is disabled until this env variable is set.",
    );
  }

  cachedConfig = {
    resendApiKey,
    resendFromEmail,
    contactToEmail,
    rateLimitWindowMs,
    rateLimitMax,
    resend,
  };

  return cachedConfig;
}

const prominentFieldOrder = [
  "main_support_area",
  "impact_level",
  "availability",
  "best_phone_number",
];
const prominentFieldPriority = new Map(
  prominentFieldOrder.map((key, index) => [key, index]),
);
const prominentFields = new Set(prominentFieldOrder);

export async function handleContactIntake({ body, headers, ip }) {
  const config = getApiConfig();
  const clientIp = getClientIp(headers, ip);

  if (isRateLimited(clientIp, config)) {
    return {
      status: 429,
      body: {
        error: "Too many submissions. Please wait a few minutes and try again.",
      },
    };
  }

  const honeypot = String(body?.honeypot || "").trim();
  if (honeypot) {
    return {
      status: 200,
      body: { ok: true },
    };
  }

  const fields = body?.fields;
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    return {
      status: 400,
      body: { error: "Invalid form submission." },
    };
  }

  const requiredKeys = [
    "main_support_area",
    "challenge_duration",
    "impact_level",
    "physical_health",
    "sleep_habits",
    "eating_habits",
    "alcohol_frequency",
    "recreational_drug_use",
    "availability",
    "best_phone_number",
    "intake_completed",
  ];

  const missingRequired = requiredKeys.some(
    (key) => !normalizeValue(fields[key]).length,
  );
  if (missingRequired) {
    return {
      status: 400,
      body: { error: "Please complete all required fields." },
    };
  }

  if (!config.resend) {
    return {
      status: 500,
      body: {
        error:
          "Email service is not configured on the server. Missing environment variable: RESEND_API_KEY",
      },
    };
  }

  if (!config.resendFromEmail) {
    return {
      status: 500,
      body: {
        error:
          "Email service is not configured on the server. Missing environment variable: RESEND_FROM_EMAIL",
      },
    };
  }

  if (!config.contactToEmail) {
    return {
      status: 500,
      body: {
        error:
          "Email service is not configured on the server. Missing environment variable: CONTACT_TO_EMAIL",
      },
    };
  }

  const fieldEntries = Object.entries(fields).filter(
    ([key, value]) => key !== "website" && formatEmailValue(key, value).length,
  );
  const orderedFieldEntries = fieldEntries.slice().sort(([keyA], [keyB]) => {
    const orderA = prominentFieldPriority.get(keyA) ?? Number.MAX_SAFE_INTEGER;
    const orderB = prominentFieldPriority.get(keyB) ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });

  const textBody = orderedFieldEntries
    .map(([key, value]) => `${formatLabel(key)}: ${formatEmailValue(key, value)}`)
    .join("\n");

  const htmlRows = orderedFieldEntries
    .map(([key, value]) => {
      const isProminent = prominentFields.has(key);
      const rowBackground = isProminent ? "#edf4ff" : "#ffffff";
      const labelWeight = isProminent ? "700" : "600";
      const valueWeight = isProminent ? "600" : "400";
      const label = escapeHtml(formatLabel(key));
      const formattedValue = escapeHtml(formatEmailValue(key, value));

      return `<tr>
        <td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:${labelWeight};vertical-align:top;background:${rowBackground};color:#0f172a;">${label}</td>
        <td style="padding:10px 12px;border:1px solid #e5e7eb;font-weight:${valueWeight};vertical-align:top;background:${rowBackground};color:#1f2937;">${formattedValue}</td>
      </tr>`;
    })
    .join("");

  try {
    const replyToEmail = getReplyToEmail(fields);
    const sendPayload = {
      from: `Tracy Nguyen <${config.resendFromEmail}>`,
      to: [config.contactToEmail],
      subject: "New Client Intake Submission",
      text: textBody,
      html: `<h2 style="margin:0 0 12px;color:#0f172a;">New Client Intake Submission</h2><table style="border-collapse:collapse;width:100%;max-width:860px;background:#ffffff;">${htmlRows}</table>`,
      ...(replyToEmail ? { replyTo: replyToEmail } : {}),
    };

    console.info("[contact-intake] sending email", {
      to: config.contactToEmail,
      replyTo: replyToEmail || null,
      from: `Tracy Nguyen <${config.resendFromEmail}>`,
    });

    const sendResult = await config.resend.emails.send(sendPayload);

    if (sendResult?.error) {
      const reason =
        typeof sendResult.error?.message === "string" &&
        sendResult.error.message.trim()
          ? sendResult.error.message.trim()
          : JSON.stringify(sendResult.error);

      return {
        status: 500,
        body: { error: `Failed to send email. ${reason}` },
      };
    }

    return {
      status: 200,
      body: { ok: true },
    };
  } catch (error) {
    console.error("Resend send failed:", error);
    const reason =
      typeof error?.message === "string" && error.message.trim()
        ? error.message.trim()
        : "Unknown email service error.";

    return {
      status: 500,
      body: { error: `Failed to send email. ${reason}` },
    };
  }
}

export function getHealthStatus() {
  const config = getApiConfig();

  return {
    ok: true,
    resendConfigured: Boolean(config.resendApiKey),
  };
}
