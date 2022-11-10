import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  birth_number: Number,
  address: String,
  username: String,
  password: String
});

// Static register method
userSchema.statics.register = async function (first_name, last_name, birth_number, address, username, password) {

  if (!username || !password) {
    throw Error("All fields must be filled");
  }

  const exists = await this.findOne({ username });

  if (exists) {
    throw Error("Username already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ first_name, last_name, birth_number, address, username, password: hash });

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

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

export default mongoose.model('user', userSchema);