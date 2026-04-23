import { PDFParse } from "pdf-parse";
import { parse as parseCsv } from "csv-parse/sync";
import type {
  ExtractedStatementTransaction,
  StatementExtractionResponse,
} from "../types/statementExtraction";
import { callGeminiWithFallback } from "./geminiClient";

const sanitizeTransaction = (
  value: Partial<ExtractedStatementTransaction>,
): ExtractedStatementTransaction | null => {
  const date = String(value.date ?? "").trim();
  const description = String(value.description ?? "").trim();
  const amount = Number(value.amount);

  if (!date || !description || !Number.isFinite(amount)) {
    return null;
  }

  return {
    date,
    description,
    amount,
  };
};

const sanitizeExtraction = (value: unknown): StatementExtractionResponse => {
  if (!value || typeof value !== "object") {
    throw new Error("Extraction response was invalid.");
  }

  const payload = value as Partial<StatementExtractionResponse>;
  if (!Array.isArray(payload.transactions)) {
    throw new Error("Extraction response missing transactions.");
  }

  const dedupe = new Set<string>();
  const transactions = payload.transactions
    .map((item) => sanitizeTransaction(item))
    .filter((item): item is ExtractedStatementTransaction => Boolean(item))
    .filter((item) => {
      const key = `${item.date}|${item.description}|${item.amount}`;
      if (dedupe.has(key)) {
        return false;
      }
      dedupe.add(key);
      return true;
    });

  return { transactions };
};

const buildPrompt = (rawText: string): string => `You are a financial data extraction engine.

Your task is to extract structured transaction data from a bank statement.

INPUT:
You will receive raw text extracted from a bank statement (PDF or CSV-like text).

GOAL:
Identify and extract ALL transactions into structured JSON.

STRICT RULES:
- Return ONLY valid JSON. No explanation, no extra text.
- Each transaction must include:
  - date (YYYY-MM-DD if possible, else original format)
  - description (cleaned, readable)
  - amount (number: negative for debit/spend, positive for credit/income)
- Ignore headers, footers, page numbers, balances unless needed to infer transactions
- Remove duplicates
- If amount format is unclear, infer logically (debit vs credit)
- Preserve order as in statement

HANDLE EDGE CASES:
- Debit/credit columns -> convert into single signed amount
- CR/DR -> CR = positive, DR = negative
- UPI/IMPS/NEFT descriptions -> keep meaningful part only
- Multi-line descriptions -> merge into one line
- Missing fields -> do best guess, do NOT skip transaction

OUTPUT FORMAT (STRICT):
{
  "transactions": [
    {
      "date": "2026-04-01",
      "description": "Swiggy Order",
      "amount": -450
    }
  ]
}

IMPORTANT:
- Do not summarize
- Do not categorize
- Do not group
- Only extraction

INPUT DATA:
${rawText}`;

const csvToRawText = (content: string): string => {
  try {
    const rows = parseCsv(content, {
      relax_column_count: true,
      skip_empty_lines: true,
    }) as string[][];
    return rows.map((row) => row.join(" | ")).join("\n");
  } catch {
    return content;
  }
};

const compactStatementText = (rawText: string): string => {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return "";
  }

  const usefulLines = lines.filter((line) => {
    const hasDate = /\d{1,4}[-/]\d{1,2}[-/]\d{1,4}/.test(line);
    const hasAmount = /(?:\d[\d,]*\.\d{1,2}|\d[\d,]{2,})/.test(line);
    const hasTxnKeywords =
      /(debit|credit|dr|cr|upi|imps|neft|txn|transaction|narration|description)/i.test(
        line,
      );
    return hasDate || hasAmount || hasTxnKeywords;
  });

  const compacted = (usefulLines.length > 0 ? usefulLines : lines)
    .slice(0, 2000)
    .join("\n");

  return compacted.slice(0, 20000);
};

export const extractStatementTransactions = async (
  fileName: string,
  mimeType: string,
  buffer: Buffer,
): Promise<StatementExtractionResponse> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const lowerName = fileName.toLowerCase();
  const isPdf =
    mimeType.includes("pdf") || lowerName.endsWith(".pdf");
  const isCsv =
    mimeType.includes("csv") ||
    lowerName.endsWith(".csv") ||
    mimeType.includes("excel");

  if (!isPdf && !isCsv) {
    throw new Error("Only CSV and PDF statements are supported.");
  }

  let rawText = "";
  if (isPdf) {
    const parser = new PDFParse({ data: buffer });
    const parsed = await parser.getText();
    rawText = parsed.text;
    await parser.destroy();
  } else {
    rawText = csvToRawText(buffer.toString("utf-8"));
  }

  if (!rawText.trim()) {
    throw new Error("Could not extract readable text from statement.");
  }

  const prompt = buildPrompt(compactStatementText(rawText));
  const llmOutput = await callGeminiWithFallback({
    apiKey,
    prompt,
    models: [
      process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash",
      "gemini-1.5-flash",
    ],
    temperature: 0,
  });

  let parsed: unknown;
  try {
    parsed = JSON.parse(llmOutput);
  } catch {
    throw new Error("Extraction response was not valid JSON.");
  }

  return sanitizeExtraction(parsed);
};
