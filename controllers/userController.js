import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import Book from "../models/bookModel.js";

// JWT
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
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

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  loginUser, registerUser, borrow
};