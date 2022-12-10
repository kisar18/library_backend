import mongoose from "mongoose";

const historySchema = mongoose.Schema({
  user: String,
  book: String,
  expiration_date: Date,
  returned: Boolean
}, { timestamps: true });

// Check history of borrows
historySchema.statics.updateItem = async function (user, book) {

  const historyItem = await this.findOneAndUpdate({ user: user, book: book, returned: false },
    { returned: true },
    { new: true });

  return (historyItem);
};

export default mongoose.model('history', historySchema);