
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
const MONGO_URL ="mongodb+srv://admin:Fb1907Fb@forum-app.mcv3k.mongodb.net/?retryWrites=true&w=majority&appName=forum-app";
const PORT = 4006;
mongoose.connect(MONGO_URL, {
  
  
  }).then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(
  cors({
    origin: ["http://localhost:4006"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }));

app.use(express.json());