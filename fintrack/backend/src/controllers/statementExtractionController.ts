import type { Request, Response } from "express";
import { extractStatementTransactions } from "../services/statementExtractionService";

export const postExtractStatement = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const file = req.file;
  if (!file) {
    res.status(400).json({ message: "Statement file is required." });
    return;
  }

  try {
    const result = await extractStatementTransactions(
      file.originalname,
      file.mimetype,
      file.buffer,
    );
    res.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Extraction failed.";
    if (message.includes("GEMINI_API_KEY")) {
      res.status(500).json({ message: "AI provider is not configured" });
      return;
    }
    if (
      message.toLowerCase().includes("rate limit") ||
      message.toLowerCase().includes("high demand")
    ) {
      res.status(429).json({ message });
      return;
    }
    if (message.includes("supported")) {
      res.status(400).json({ message });
      return;
    }
    res.status(502).json({ message });
  }
};
