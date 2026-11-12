import "dotenv/config";
import app from "./app.js";
import { prisma } from "./config/database.js";

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully!");

    app.listen(PORT, () => {
      console.log(`TaxMate backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start TaxMate backend:", error);
    process.exit(1);
  }
}

startServer();