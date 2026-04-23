"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const transactionController_1 = require("../controllers/transactionController");
const aiInsightController_1 = require("../controllers/aiInsightController");
const statementExtractionController_1 = require("../controllers/statementExtractionController");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
});
router.get("/transactions", transactionController_1.getTransactions);
router.post("/transactions", transactionController_1.addTransaction);
router.post("/transactions/extract-statement", upload.single("statement"), statementExtractionController_1.postExtractStatement);
router.delete("/transactions/:id", transactionController_1.deleteTransaction);
router.get("/insights", transactionController_1.getInsights);
router.post("/ai-insights", aiInsightController_1.postAiInsights);
exports.default = router;
