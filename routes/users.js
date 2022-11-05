import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

// Login
router.post("/login", userController.loginUser);

// Register
router.post("/register", userController.registerUser);

export default router;