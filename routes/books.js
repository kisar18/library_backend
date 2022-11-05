import express from "express";
import bookController from "../controllers/bookController.js";

const router = express.Router();

// GET all books
router.get("/", bookController.getBooks)

// GET a single book
router.get("/:id", bookController.getBook)

// POST a new book
router.post("/", bookController.createBook)

// UPDATE a book
router.patch("/", bookController.updateBook)

// DELETE a book
router.delete("/", bookController.deleteBook)

export default router