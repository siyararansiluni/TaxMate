import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";

const app = express();

// Global middleware
app.use(cors());
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