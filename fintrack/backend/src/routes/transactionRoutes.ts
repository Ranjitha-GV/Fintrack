import { Router } from "express";
import {
  addTransaction,
  deleteTransaction,
  getInsights,
  getTransactions,
} from "../controllers/transactionController";

const router = Router();

router.get("/transactions", getTransactions);
router.post("/transactions", addTransaction);
router.delete("/transactions/:id", deleteTransaction);
router.get("/insights", getInsights);

export default router;
