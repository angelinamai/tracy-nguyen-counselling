import { handleGetCourseAccess } from "../../server/courseApi.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const result = await handleGetCourseAccess({
    headers: req.headers,
    query: req.query,
  });

  return res.status(result.status).json(result.body);
}
