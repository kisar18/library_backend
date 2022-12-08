import User from "../models/userModel.js";
import Book from "../models/bookModel.js";
import jwt from "jsonwebtoken";

// JWT
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const q = req.query.q;

    const search = q && q.length >= 3 ? {
      "$or": [
        { username: { $regex: q, $options: "$i" } },
        { first_name: { $regex: q, $options: "$i" } },
        { last_name: { $regex: q, $options: "$i" } }
      ]
    } : {};

    const PAGESIZE = parseInt(req.query.ps) || "5";
    const page = parseInt(req.query.page) || "0";

    const users = await User.find(search).limit(PAGESIZE).skip(PAGESIZE * page);
    const total = (await User.find(search)).length;
    res.status(200).json({ PAGESIZE, total, users });
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get current user
const getUser = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "No such a user" });
    }

    const PAGESIZE = 5;
    const page = parseInt(req.query.page) || "0";
    const total = await user.books.length;

    let books = [null * total];
    for (let i = (PAGESIZE * page); i < PAGESIZE - (PAGESIZE - (total % PAGESIZE)); i++) {
      books[i] = user.books[i];
    }

    //const books = await user.books.limit(PAGESIZE).skip(PAGESIZE * page);

    res.status(200).json({ user, books, total });
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }

};

// Login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.login(username, password);

    const token = createToken(user._id);

    res.status(200).json({ username, token });
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Register user
const registerUser = async (req, res) => {
  const { first_name, last_name, birth_number, address, username, password } = req.body;

  try {
    const user = await User.register(first_name, last_name, birth_number, address, username, password);

    const hashed_password = user.password;
    const token = createToken(user._id);

    res.status(200).json({ first_name, last_name, birth_number, address, username, hashed_password, token });
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Borrow a book
const borrow = async (req, res) => {
  const { username, _id } = req.body;

  try {
    const user = await User.borrow(username, _id);

    const PAGESIZE = 5;
    const page = parseInt(req.query.page) || "0";

    const books = await Book.find({}).limit(PAGESIZE).skip(PAGESIZE * page);

    res.status(200).json({ user, books });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Return a book
const returnBook = async (req, res) => {
  const { username, name } = req.body;

  try {
    const userBooks = await User.returnBook(username, name);

    res.status(200).json({ userBooks });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Verify user
const updateUserStatus = async (req, res) => {
  const { username, newStatus } = req.body;

  try {
    const user = await User.updateUserStatus(username, newStatus);

    res.status(200).json(user);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  getUsers, getUser, loginUser, registerUser, borrow, returnBook, updateUserStatus
};