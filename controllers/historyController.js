import History from "../models/historyModel.js";

// Get history of borrows
const getHistory = async (req, res) => {
  try {
    const q = req.query.q;

    const search = q ? {
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
  const { user, book } = req.body;

  try {
    const historyItem = await History.create({ user, book });
    res.status(200).json(historyItem);
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  getHistory, createHistoryItem
};