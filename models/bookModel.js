import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
  name: String,
  author: String,
  pages: Number,
  publication_year: String,
  image: String,
  quantity: Number
});

export default mongoose.model('book', bookSchema);