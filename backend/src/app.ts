import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";

const app = express();

// Global middleware
const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());



app.use("/api/auth", authRoutes);
// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "TaxMate backend is running",
  });
});

export default app;