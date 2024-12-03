const e = require("express");
const { Signup,Login,Entry,getAllEntries,getCurrentlyUsername,saveMessages,getMessages,getCurrentlyEntry} = require("../Controllers/AuthController");
const router = require("express").Router();
const {userVerification,authenticateUser} = require("../Middlewares/AuthMiddlewares");
const { verify } = require("jsonwebtoken");
router.get("/getusername",authenticateUser,getCurrentlyUsername);
router.get("/entries", getAllEntries);
router.get("/entries/:id", getCurrentlyEntry);
router.get("/getmessages",getMessages,authenticateUser);
router.post("/entry", Entry);
router.post("/signup", Signup);
router.post("/login",Login);
router.post("/",userVerification);
router.post("/savemessages",saveMessages,authenticateUser);
router.get("verifytoken",verify)
module.exports = router;