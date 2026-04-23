import { Router } from "express";
import multer from "multer";
import {
  addTransaction,
  deleteTransaction,
  getInsights,
  getTransactions,
} from "../controllers/transactionController";
import { postAiInsights } from "../controllers/aiInsightController";
import { postExtractStatement } from "../controllers/statementExtractionController";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.get("/transactions", getTransactions);
router.post("/transactions", addTransaction);
router.post(
  "/transactions/extract-statement",
  upload.single("statement"),
  postExtractStatement,
);
router.delete("/transactions/:id", deleteTransaction);
router.get("/insights", getInsights);
router.post("/ai-insights", postAiInsights);

export default router;
