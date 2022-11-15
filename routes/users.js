import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

// Get current user
router.get("/", userController.getUser);

// Login
router.post("/login", userController.loginUser);

// Register
router.post("/register", userController.registerUser);

// Borrow a book
router.post("/borrow", userController.borrow);

export default router;