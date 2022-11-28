import mongoose from "mongoose";
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";

// Get all books with pagination
const getBooks = async (req, res) => {

  try {
    const q = req.query.q;

    const search = q ? {
      "$or": [
        { name: { $regex: q, $options: "$i" } },
        { author: { $regex: q, $options: "$i" } }
      ]
    } : {};

    const PAGESIZE = parseInt(req.query.ps) || "5";
    const page = parseInt(req.query.page) || "0";

    const books = await Book.find(search).limit(PAGESIZE).skip(PAGESIZE * page);
    const total = (await Book.find(search)).length;

    res.status(200).json({ PAGESIZE, total, books });
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single book
const getBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such a book" });
  }

  const book = await Book.findById(id);

  if (!book) {
    return res.status(404).json({ error: "No such a book" });
  }

  res.status(200).json(book);
};

// Create new book
const createBook = async (req, res) => {
  const { name, author, pages, publication_year, image, quantity } = req.body;

  let emptyFields = [];

  if (!name) {
    emptyFields.push('name');
  }
  if (!author) {
    emptyFields.push('author');
  }
  if (!publication_year) {
    emptyFields.push('publication_year');
  }
  if (!pages) {
    emptyFields.push('pages');
  }
  if (!image) {
    emptyFields.push('image');
  }
  if (!quantity) {
    emptyFields.push('quantity');
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all the fields', emptyFields, name });
  }

  try {
    const book = await Book.create({ name, author, publication_year, pages, image, quantity });
    res.status(200).json(book);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a book
const updateBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such book' });
  }

  const book = await Book.findOneAndUpdate({ _id: id }, {
    ...req.body
  });

  if (!book) {
    return res.status(400).json({ error: 'No such book' });
  }

  res.status(200).json(book);
};

// Delete a book
const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const users = await User.find({ 'books.0': { $exists: true } });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such book', id });
    }

    const book = await Book.findOneAndDelete({ _id: id });
    //const book = await Book.findOne({ _id: id });

    if (!book) {
      return res.status(400).json({ error: 'No such book', id });
    }

    const bookName = book.name;

    var bookToReturn;
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < users[i].books.length; j++) {
        if (bookName === users[i].books[j].name) {
          bookToReturn = users[i].books[j];
        }
      }

      if (bookToReturn) {
        await users[i].books.remove(bookToReturn);
        await users[i].save();
      }
    }

    res.status(200).json(book);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export default {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
};