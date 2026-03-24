import express from "express";
import { getHealthStatus, handleContactIntake } from "./contactApi.js";

const app = express();
const port = Number(process.env.API_PORT || 8787);

app.use(express.json({ limit: "1mb" }));

app.post("/api/contact-intake", async (req, res) => {
  const result = await handleContactIntake({
    body: req.body,
    headers: req.headers,
    ip: req.ip || req.socket?.remoteAddress || "unknown",
  });

  return res.status(result.status).json(result.body);
});

app.get("/api/health", (_req, res) => {
  return res.status(200).json(getHealthStatus());
});

app.listen(port, () => {
  console.log(`Contact API listening on http://localhost:${port}`);
});
