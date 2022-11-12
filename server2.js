import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bookRoutes from "./routes/books.js";
import userRoutes from "./routes/users.js";
import dotenv from "dotenv";

// App config
dotenv.config();
const app = express();
const port = process.env.PORT;
const connection_url = process.env.URI;

// Middleware
app.use(express.json());
app.use(cors());
app.use("/books", bookRoutes);
app.use("/user", userRoutes);

// DB config
mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// API endpoints
app.get('/', (req, res) => res.status(200).send("Hello world"));

// Listener
app.listen(port, () => console.log(`Listening on port: ${port}`));