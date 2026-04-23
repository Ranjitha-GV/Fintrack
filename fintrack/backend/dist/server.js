"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
(0, dotenv_1.config)({ path: node_path_1.default.resolve(__dirname, "../.env"), override: true });
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use("/", transactionRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is missing. /ai-insights will fail until backend/.env is configured.");
    }
});
