import express from "express";
import cors from "cors";

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "TaxMate backend is running",
  });
});

export default app;