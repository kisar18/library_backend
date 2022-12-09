import mongoose from "mongoose";

const historySchema = mongoose.Schema({
  user: String,
  book: String,
  expiration_date: Date,
  returned: Boolean
}, { timestamps: true });

export default mongoose.model('history', historySchema);