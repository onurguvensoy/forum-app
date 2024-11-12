
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
require("dotenv").config();
const {MONGO_URL,PORT} = process.env;
mongoose.connect(MONGO_URL, {
  }).then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));
 app.listen(4000, () =>{
  console.log(`Server is running on port ${PORT}`)
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