import History from "../models/historyModel.js";
import Book from "../models/bookModel.js";

// Get history of borrows
const getHistory = async (req, res) => {
  try {
    const q = req.query.q;

    const search = q && q.length >= 3 ? {
      "$or": [
        { user: { $regex: q, $options: "$i" } },
        { book: { $regex: q, $options: "$i" } }
      ]
    } : {};

    const PAGESIZE = parseInt(req.query.ps) || "5";
    const page = parseInt(req.query.page) || "0";

    const historyItems = await History.find(search).limit(PAGESIZE).skip(PAGESIZE * page);
    const total = (await History.find(search)).length;

    res.status(200).json({ PAGESIZE, total, historyItems });
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update history of borrows
const createHistoryItem = async (req, res) => {
  const { user, bookId } = req.body;

  try {
    const book = await Book.findById(bookId);
    const bookName = book.name;

    const historyItem = await History.create({ user, book: bookName });
    res.status(200).json(historyItem);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  getHistory, createHistoryItem
};