import express from "express";
import mongoose from "mongoose";
import Book from "./dbBooks.js";
import Customer from "./dbCustomers.js";
import cors from "cors";
import jwt from "jsonwebtoken";

// App config
const app = express();
const port = process.env.PORT || 8001
const connection_url = "mongodb+srv://librarian:admin@pdproject.zkvldhb.mongodb.net/pdProject"

// Middleware
app.use(express.json());
app.use(cors());

// DB config
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createToken = (_id) => {
  return jwt.sign({_id}, 'abc', { expiresIn: '3d' })
}

// API endpoints
app.get('/', (req, res) => res.status(200).send("Hello world"));

app.post('/books', (req, res) => {
  const dbBook = req.body;

  Book.create(dbBook, (err, data) => {
    if(err) {
      res.status(500).send(err)
    }
    else {
      res.status(201).send(data)
    }
  });
});

app.get('/books', (req, res) => {
  Book.find((err, data) => {
    if(err) {
      res.status(500).send(err)
    }
    else {
      res.status(200).send(data)
    }
  });
});

app.post('/customers', (req, res) => {
  const dbCustomer = req.body;

  Customer.create(dbCustomer, (err, data) => {
    if(err) {
      res.status(500).send(err)
    }
    else {
      res.status(201).send(data)
    }
  });
});

app.get('/customers', (req, res) => {
  Customer.find((err, data) => {
    if(err) {
      res.status(500).send(err)
    }
    else {
      res.status(200).send(data)
    }
  });
});

app.post("/login", (req, res) => {
  const dbCustomer = req.body;
  const {username, password} = req.body;

  Customer.findOne(dbCustomer, (err, data) => {
    if(err) {
      res.status(500).send(err)
    }
    else {
      const token = createToken(dbCustomer._id)

      res.status(200).send({username, token})
      return res.data
    }
  })
});

// Listener
app.listen(port, () => console.log(`Listening on port: ${port}`))