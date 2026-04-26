import express from "express";
import { getHealthStatus, handleContactIntake } from "./contactApi.js";
import {
  handleConfirmCoursePurchase,
  handleCreateCourseCheckout,
  handleGetCourseAccess,
} from "./courseApi.js";

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

app.post("/api/course/checkout", async (req, res) => {
  const result = await handleCreateCourseCheckout({
    headers: req.headers,
    body: req.body,
  });

  return res.status(result.status).json(result.body);
});

app.post("/api/course/confirm", async (req, res) => {
  const result = await handleConfirmCoursePurchase({
    headers: req.headers,
    body: req.body,
  });

  return res.status(result.status).json(result.body);
});

app.get("/api/course/access", async (req, res) => {
  const result = await handleGetCourseAccess({
    headers: req.headers,
    query: req.query,
  });

  return res.status(result.status).json(result.body);
});

app.get("/api/health", (_req, res) => {
  return res.status(200).json(getHealthStatus());
});

app.listen(port, () => {
  console.log(`Contact API listening on http://localhost:${port}`);
});
