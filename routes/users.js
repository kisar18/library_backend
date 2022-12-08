import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

// Get all users
router.get("/", userController.getUsers);

// Get current user
router.get("/:username", userController.getUser);

// Change user status
//router.put("/:username", userController.updateUserStatus);

// Edit user
router.patch("/:username", userController.editUser);

// Login
router.post("/login", userController.loginUser);

// Register
router.post("/register", userController.registerUser);

// Borrow a book
router.post("/borrow", userController.borrow);

// Return a book
router.post("/returnBook", userController.returnBook);

export default router;