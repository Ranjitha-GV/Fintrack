import path from "node:path";
import { config as loadEnv } from "dotenv";
import cors from "cors";
import express from "express";
import transactionRoutes from "./routes/transactionRoutes";

loadEnv({ path: path.resolve(__dirname, "../.env"), override: true });

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/", transactionRoutes);

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn("GEMINI_API_KEY is missing. /ai-insights will fail until backend/.env is configured.");
  }
});
