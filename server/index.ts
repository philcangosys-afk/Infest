import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleAiAdvisor } from "./routes/aiAdvisor";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ type: "*/*", limit: "8mb" }));
  app.use(express.urlencoded({ extended: true, limit: "8mb" }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/ai-advisor", handleAiAdvisor);

  return app;
}
