import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let envLoaded = false;
let cachedConfig = null;

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

function normalizeValue(value) {
  return String(value || "").trim();
}

function parseCoursePriceMap(rawValue) {
  const normalized = normalizeValue(rawValue);
  if (!normalized) {
    return {};
  }

  try {
    const parsed = JSON.parse(normalized);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return Object.fromEntries(
        Object.entries(parsed)
          .map(([slug, priceId]) => [normalizeValue(slug), normalizeValue(priceId)])
          .filter(([slug, priceId]) => slug && priceId),
      );
    }
  } catch {
    // Fall back to comma-separated slug=price format.
  }

  return Object.fromEntries(
    normalized
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const [slug, ...rest] = entry.split("=");
        return [normalizeValue(slug), normalizeValue(rest.join("="))];
      })
      .filter(([slug, priceId]) => slug && priceId),
  );
}

function resolveStripePriceId(config, courseSlug) {
  if (config.stripeCoursePriceMap[courseSlug]) {
    return config.stripeCoursePriceMap[courseSlug];
  }

  if (courseSlug === config.courseSlug && config.stripeCoursePriceId) {
    return config.stripeCoursePriceId;
  }

  // Backward compatibility: one global course price for all course slugs.
  if (config.stripeCoursePriceId && !Object.keys(config.stripeCoursePriceMap).length) {
    return config.stripeCoursePriceId;
  }

  return "";
}

function getBearerToken(headers) {
  const authorization = headers?.authorization || headers?.Authorization || "";
  if (!authorization.startsWith("Bearer ")) {
    return "";
  }
  return authorization.slice(7).trim();
}

function resolveBaseUrl(headers, appUrl) {
  if (appUrl) {
    return appUrl.replace(/\/$/, "");
  }

  const forwardedHost = normalizeValue(headers?.["x-forwarded-host"]);
  const forwardedProto = normalizeValue(headers?.["x-forwarded-proto"]) || "https";
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  const host = normalizeValue(headers?.host);
  if (!host) {
    return "http://localhost:5173";
  }

  if (host.includes("localhost:8787") || host.includes("127.0.0.1:8787")) {
    return "http://localhost:5173";
  }

  const protocol =
    host.includes("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
  return `${protocol}://${host}`;
}

function getConfig() {
  if (cachedConfig) {
    return cachedConfig;
  }

  const supabaseUrl = normalizeValue(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  );
  const supabaseServiceRoleKey = normalizeValue(process.env.SUPABASE_SERVICE_ROLE_KEY);
  const stripeSecretKey = normalizeValue(process.env.STRIPE_SECRET_KEY);
  const stripeCoursePriceId = normalizeValue(process.env.STRIPE_COURSE_PRICE_ID);
  const stripeCoursePriceMap = parseCoursePriceMap(process.env.STRIPE_COURSE_PRICE_MAP);
  const courseSlug =
    normalizeValue(process.env.COURSE_SLUG || process.env.VITE_COURSE_SLUG) ||
    "tracy-course-1";

  const appUrl = normalizeValue(process.env.APP_URL);

  const supabaseAdmin =
    supabaseUrl && supabaseServiceRoleKey
      ? createClient(supabaseUrl, supabaseServiceRoleKey, {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        })
      : null;

  const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

  cachedConfig = {
    supabaseAdmin,
    stripe,
    stripeCoursePriceId,
    stripeCoursePriceMap,
    courseSlug,
    appUrl,
  };

  return cachedConfig;
}

async function getAuthenticatedUser(headers, config) {
  const token = getBearerToken(headers);
  if (!token) {
    return {
      error: {
        status: 401,
        body: { error: "Please sign in to continue." },
      },
      token: "",
      user: null,
    };
  }

  if (!config.supabaseAdmin) {
    return {
      error: {
        status: 500,
        body: {
          error:
            "Supabase server configuration is missing. Required env: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
        },
      },
      token,
      user: null,
    };
  }

  const { data, error } = await config.supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) {
    return {
      error: {
        status: 401,
        body: { error: "Your session has expired. Please sign in again." },
      },
      token,
      user: null,
    };
  }

  return { error: null, token, user: data.user };
}

async function tryGetAuthenticatedUser(headers, config) {
  const token = getBearerToken(headers);
  if (!token || !config.supabaseAdmin) {
    return null;
  }

  const { data, error } = await config.supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) {
    return null;
  }

  return data.user;
}

async function checkCourseAccess(config, { userId, courseSlug }) {
  const { data, error } = await config.supabaseAdmin
    .from("course_access")
    .select("id")
    .eq("user_id", userId)
    .eq("course_slug", courseSlug)
    .maybeSingle();

  if (error) {
    return { error, hasAccess: false };
  }

  return { error: null, hasAccess: Boolean(data?.id) };
}

export async function handleGetCourseAccess({ headers, query }) {
  const config = getConfig();
  const targetCourseSlug = normalizeValue(query?.courseSlug) || config.courseSlug;

  const { user, error } = await getAuthenticatedUser(headers, config);
  if (error) {
    return error;
  }

  const accessResult = await checkCourseAccess(config, {
    userId: user.id,
    courseSlug: targetCourseSlug,
  });

  if (accessResult.error) {
    return {
      status: 500,
      body: { error: "Unable to check course access right now." },
    };
  }

  return {
    status: 200,
    body: {
      hasAccess: accessResult.hasAccess,
      courseSlug: targetCourseSlug,
    },
  };
}

export async function handleCreateCourseCheckout({ headers, body }) {
  const config = getConfig();

  if (!config.stripe) {
    return {
      status: 500,
      body: { error: "Missing STRIPE_SECRET_KEY on server." },
    };
  }

  const targetCourseSlug = normalizeValue(body?.courseSlug) || config.courseSlug;
  const targetPriceId = resolveStripePriceId(config, targetCourseSlug);

  if (!targetPriceId) {
    return {
      status: 400,
      body: {
        error:
          "No Stripe price is configured for this course. Set STRIPE_COURSE_PRICE_MAP or STRIPE_COURSE_PRICE_ID.",
      },
    };
  }

  const user = await tryGetAuthenticatedUser(headers, config);
  if (user && config.supabaseAdmin) {
    const accessResult = await checkCourseAccess(config, {
      userId: user.id,
      courseSlug: targetCourseSlug,
    });

    if (accessResult.error) {
      return {
        status: 500,
        body: { error: "Unable to verify course access right now." },
      };
    }

    if (accessResult.hasAccess) {
      return {
        status: 200,
        body: {
          alreadyPurchased: true,
          checkoutUrl: null,
        },
      };
    }
  }

  const appBaseUrl = resolveBaseUrl(headers, config.appUrl);
  const encodedCourseSlug = encodeURIComponent(targetCourseSlug);
  const successUrl = `${appBaseUrl}/courses/success?session_id={CHECKOUT_SESSION_ID}&course=${encodedCourseSlug}`;
  const cancelUrl = `${appBaseUrl}/courses?checkout=cancelled&course=${encodedCourseSlug}`;

  try {
    const session = await config.stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: targetPriceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: user?.email || undefined,
      client_reference_id: user?.id || undefined,
      metadata: {
        course_slug: targetCourseSlug,
        ...(user?.id ? { user_id: user.id } : {}),
      },
    });

    if (!session.url) {
      return {
        status: 500,
        body: { error: "Stripe did not return a checkout URL." },
      };
    }

    return {
      status: 200,
      body: {
        checkoutUrl: session.url,
        alreadyPurchased: false,
      },
    };
  } catch (stripeError) {
    return {
      status: 500,
      body: {
        error:
          stripeError?.message ||
          "Unable to create checkout session right now.",
      },
    };
  }
}

export async function handleConfirmCoursePurchase({ headers, body }) {
  const config = getConfig();

  if (!config.stripe) {
    return {
      status: 500,
      body: { error: "Missing STRIPE_SECRET_KEY on server." },
    };
  }

  const requestedCourseSlug = normalizeValue(body?.courseSlug);
  const stripeSessionId = normalizeValue(body?.sessionId);

  if (!stripeSessionId) {
    return {
      status: 400,
      body: { error: "Missing Stripe session ID." },
    };
  }

  let checkoutSession;
  try {
    checkoutSession = await config.stripe.checkout.sessions.retrieve(stripeSessionId);
  } catch (stripeError) {
    return {
      status: 400,
      body: {
        error: stripeError?.message || "Invalid Stripe session ID.",
      },
    };
  }

  if (checkoutSession.mode !== "payment") {
    return {
      status: 400,
      body: { error: "This Stripe session is not a payment session." },
    };
  }

  if (checkoutSession.payment_status !== "paid") {
    return {
      status: 400,
      body: { error: "Payment is not completed for this session." },
    };
  }

  const paidUserId = normalizeValue(checkoutSession.metadata?.user_id);
  const paidCourseSlug = normalizeValue(checkoutSession.metadata?.course_slug) || config.courseSlug;

  if (requestedCourseSlug && paidCourseSlug !== requestedCourseSlug) {
    return {
      status: 400,
      body: { error: "Course mismatch for this payment." },
    };
  }

  const user = await tryGetAuthenticatedUser(headers, config);
  if (user && paidUserId && paidUserId !== user.id) {
    return {
      status: 403,
      body: { error: "This payment does not belong to your account." },
    };
  }

  let granted = false;
  if (config.supabaseAdmin && user && paidUserId && paidUserId === user.id) {
    const { error: upsertError } = await config.supabaseAdmin
      .from("course_access")
      .upsert(
        {
          user_id: user.id,
          course_slug: paidCourseSlug,
          stripe_session_id: checkoutSession.id,
        },
        { onConflict: "user_id,course_slug" },
      );

    if (upsertError) {
      return {
        status: 500,
        body: {
          error:
            upsertError.message ||
            "Unable to grant course access right now.",
        },
      };
    }

    console.info("[course-purchase] access granted", {
      userId: user.id,
      courseSlug: paidCourseSlug,
      stripeSessionId: checkoutSession.id,
    });
    granted = true;
  }

  return {
    status: 200,
    body: {
      confirmed: true,
      granted,
      courseSlug: paidCourseSlug,
    },
  };
}
