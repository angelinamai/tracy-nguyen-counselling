import dotenv from "dotenv";
import express from "express";
import { Resend } from "resend";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, ".env.local"), override: true });

const app = express();
const port = Number(process.env.API_PORT || 8787);
const resendApiKey = process.env.RESEND_API_KEY;
const resendFromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const isDevelopment = process.env.NODE_ENV !== "production";
const contactToEmail =
  process.env.CONTACT_TO_EMAIL ||
  (isDevelopment ? "angelinaxu9@gmail.com" : "tracyincounseling@gmail.com");
const rateLimitWindowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 600000);
const rateLimitMax = Number(process.env.RATE_LIMIT_MAX || 5);
const resend = resendApiKey ? new Resend(resendApiKey) : null;

if (!resendApiKey) {
  console.warn(
    "Missing RESEND_API_KEY. Email sending is disabled until this env variable is set.",
  );
}
const requestLog = new Map();

app.use(express.json({ limit: "1mb" }));

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || "unknown";
}

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (requestLog.get(ip) || []).filter(
    (timestamp) => now - timestamp < rateLimitWindowMs,
  );

  if (recent.length >= rateLimitMax) {
    requestLog.set(ip, recent);
    return true;
  }

  recent.push(now);
  requestLog.set(ip, recent);
  return false;
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

app.post("/api/contact-intake", async (req, res) => {
  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    return res.status(429).json({
      error: "Too many submissions. Please wait a few minutes and try again.",
    });
  }

  const honeypot = String(req.body?.honeypot || "").trim();
  if (honeypot) {
    return res.status(200).json({ ok: true });
  }

  const fields = req.body?.fields;
  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    return res.status(400).json({ error: "Invalid form submission." });
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
    return res.status(400).json({ error: "Please complete all required fields." });
  }

  if (!resend) {
    return res
      .status(500)
      .json({
        error:
          "Email service is not configured on the server. Missing environment variable: RESEND_API_KEY",
      });
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
    const sendResult = await resend.emails.send({
      from: resendFromEmail,
      to: [contactToEmail],
      subject: "New Client Intake Submission",
      text: textBody,
      html: `<h2 style="margin:0 0 12px;color:#0f172a;">New Client Intake Submission</h2><table style="border-collapse:collapse;width:100%;max-width:860px;background:#ffffff;">${htmlRows}</table>`,
    });

    if (sendResult?.error) {
      const reason =
        typeof sendResult.error?.message === "string" &&
        sendResult.error.message.trim()
          ? sendResult.error.message.trim()
          : JSON.stringify(sendResult.error);
      return res.status(500).json({ error: `Failed to send email. ${reason}` });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Resend send failed:", error);
    const reason =
      typeof error?.message === "string" && error.message.trim()
        ? error.message.trim()
        : "Unknown email service error.";
    return res.status(500).json({ error: `Failed to send email. ${reason}` });
  }
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    resendConfigured: Boolean(resendApiKey),
  });
});

app.listen(port, () => {
  console.log(`Contact API listening on http://localhost:${port}`);
});
