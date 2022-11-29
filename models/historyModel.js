import mongoose from "mongoose";

const historySchema = mongoose.Schema({
  user: String,
  book: String
}, { timestamps: true });

export default mongoose.model('history', historySchema);