import express from "express";
import historyController from "../controllers/historyController.js";

const router = express.Router();

// Return history of borrows by all users
router.get("/", historyController.getHistory);

// Update history of borrows
router.post("/", historyController.createHistoryItem);

export default router;