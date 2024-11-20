
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
require("dotenv").config();
const MONGO_URL = "mongodb+srv://admin:Fb1907Fb@forum-app.mcv3k.mongodb.net/?retryWrites=true&w=majority&appName=forum-app";
const PORT = process.env.PORT;

mongoose.connect(MONGO_URL, {
  

  }).then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

app.listen(4000, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }));

  app.use(cookieParser());

  app.use(express.json());
  
  app.use("/", authRoute);