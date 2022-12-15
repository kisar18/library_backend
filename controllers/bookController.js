import mongoose from "mongoose";
import Book from "../models/bookModel.js";
import User from "../models/userModel.js";

// Get all books with pagination
const getBooks = async (req, res) => {

  try {
    const q = req.query.q;

    const search = q && q.length >= 3 ? {
      "$or": [
        { name: { $regex: q, $options: "$i" } },
        { author: { $regex: q, $options: "$i" } },
        { publication_year: { $regex: q, $options: "$i" } }
      ]
    } : {};

    const PAGESIZE = parseInt(req.query.ps) || "5";
    const page = parseInt(req.query.page) || "0";
    const sortCategory = req.query.s || "";

    const books = await Book.find(search).limit(PAGESIZE).skip(PAGESIZE * page).sort(sortCategory);
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

  if (!image.startsWith("https://covers.openlibrary.org/b/isbn/")) {
    return res.status(400).json({
      error: 'Image of the book must be URL from Open Library with ISBN code of the book (https://covers.openlibrary.org/b/isbn/9513114724-S.jpg)'
    });
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

  try {
    const users = await User.find({ 'books.0': { $exists: true } });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such book', id });
    }

    const book = await Book.findOneAndUpdate({ _id: id }, {
      ...req.body
    }, { new: true });

    if (!book) {
      return res.status(400).json({ error: 'No such book', id });
    }

    if (book.quantity < 0) {
      return res.status(400).json({ error: "It is not possible to set book quantity to negative number" });
    }

    const bookName = book.name;
    var userHasThisBook = false;
    var bName;

    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < users[i].books.length; j++) {
        bName = users[i].books[j].name;
        if (bookName === users[i].books[j].name) {
          users[i].books[j] = book;
          userHasThisBook = true;
        }
      }

      if (userHasThisBook) {
        await users[i].save();
        userHasThisBook = false;
      }
    }

    res.status(200).json(book);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
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

    if (!book) {
      return res.status(400).json({ error: 'No such book', id });
    }

    for (let i = 0; i < users.length; i++) {
      var u = users[i];
      for (let j = 0; j < u.books.length; j++) {
        if (u.books[j].name == book.name) {
          return res.status(400).json({ error: 'You cant delete book which is borrowed by some user' });
        }
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