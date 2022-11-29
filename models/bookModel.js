import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
  name: String,
  author: String,
  pages: Number,
  publication_year: Number,
  image: String,
  quantity: Number
});

export default mongoose.model('book', bookSchema);