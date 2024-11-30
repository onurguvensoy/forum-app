
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");

require("dotenv").config();

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

mongoose.connect(process.env.MONGO_URL, {
  }).then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
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

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}