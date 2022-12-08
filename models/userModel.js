import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Book from "./bookModel.js";

const userSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  birth_number: Number,
  address: String,
  username: String,
  password: String,
  account_status: String,
  books: [{
    name: String,
    author: String,
    pages: Number,
    publication_year: Number,
    image: String,
  }]
});

// Static register method
userSchema.statics.register = async function (first_name, last_name, birth_number, address, username, password) {

  if (!username || !password || !first_name || !last_name || !birth_number || !address) {
    throw Error("All fields must be filled");
  }

  const exists = await this.findOne({ username });

  if (exists) {
    throw Error("Username already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    first_name,
    last_name,
    birth_number,
    address,
    username,
    password: hash,
    account_status: "waiting"
  });

  return user;
};

// Static login method
userSchema.statics.login = async function (username, password) {

  if (!username || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ username });

  if (!user) {
    throw Error("Incorrect username");
  }

  if (user.account_status === "waiting") {
    throw Error(`Account ${user.username} is waiting for verification by admin`);
  }

  if (user.account_status === "banned") {
    throw Error(`Account ${user.username} is banned`);
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

userSchema.statics.borrow = async function (username, _id) {

  const user = await this.findOne({ username });
  const book = await Book.findById({ _id });

  if (!user) {
    throw Error("User doesnt exist");
  }

  if (user.books.length === 6) {
    throw Error("Maximum of borrowed books is 6");
  }

  if (book.quantity === 0) {
    throw Error("This book is not available right now");
  }

  for (let i = 0; i < user.books.length; i++) {
    if (user.books[i].name === book.name) {
      throw Error("You already borrowed this book");
    }
  }

  await user.books.push({
    name: book.name,
    author: book.author,
    pages: book.pages,
    publication_year: book.publication_year,
    image: book.image
  });

  book.quantity = book.quantity - 1;

  await user.save();
  await book.save();

  return user;
};

userSchema.statics.returnBook = async function (username, name) {
  const user = await this.findOne({ username });

  const bookInCatalogue = await Book.findOne({ name });

  var bookToReturn;

  if (!bookInCatalogue) {
    throw Error("Cant find the book in catalogue");
  }

  for (let i = 0; i < user.books.length; i++) {
    if (bookInCatalogue.name === user.books[i].name) {
      bookToReturn = user.books[i];
    }
  }

  if (!bookToReturn) {
    throw Error("Cannot find the book in your borrows");
  }

  if (bookToReturn) {
    bookInCatalogue.quantity = bookInCatalogue.quantity + 1;

    await user.books.remove(bookToReturn);
    await user.save();
    await bookInCatalogue.save();
  }

  return user.books;
};

userSchema.statics.updateUserStatus = async function (username, newStatus) {
  const user = await this.findOne({ username });

  if (!user) {
    throw Error("Incorrect username");
  }

  if (user.account_status === newStatus) {
    throw Error(`This user is already ${newStatus}`);
  }

  if (user.account_status === "waiting" && newStatus === "banned") {
    throw Error("This user cant be banned because the account is not verified");
  }

  if (user.account_status === "waiting" && newStatus === "unbanned") {
    throw Error("This user cant be unbanned because the account is not verified");
  }

  if (user.account_status === "verified" && newStatus === "unbanned") {
    throw Error("This user cant be unbanned because the account is not banned");
  }

  if (user.account_status === "banned" && newStatus === "verified") {
    throw Error("This user cant be verified because the account is banned");
  }

  user.account_status = newStatus;
  await user.save();

  return user;
};

export default mongoose.model('user', userSchema);