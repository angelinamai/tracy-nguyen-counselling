import { handleCreateCourseCheckout } from "../../server/courseApi.js";

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }

  let rawBody = "";
  for await (const chunk of req) {
    rawBody += chunk;
  }

  if (!rawBody.trim()) {
    return {};
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const body = await readJsonBody(req);
  if (body === null) {
    return res.status(400).json({ error: "Invalid JSON payload." });
  }

  const result = await handleCreateCourseCheckout({
    headers: req.headers,
    body,
  });

  return res.status(result.status).json(result.body);
}
