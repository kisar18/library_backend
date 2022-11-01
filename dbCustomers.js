import mongoose from "mongoose";

const customerSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    birth_number: Number,
    address: String,
    username: String,
    password: String
});

export default mongoose.model('customer', customerSchema)