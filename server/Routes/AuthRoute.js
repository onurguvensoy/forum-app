const e = require("express");
const { Signup,Login,Entry,getAllEntries,getCurrentlyUsername,saveMessages,getMessages,getCurrentlyEntry} = require("../Controllers/AuthController");
const router = require("express").Router();
const {userVerification,authenticateUser} = require("../Middlewares/AuthMiddlewares")
router.get("/getusername",authenticateUser,getCurrentlyUsername);
router.get("/entries", getAllEntries);
router.get("/entries/:id", getCurrentlyEntry);
router.get("/getmessages",getMessages,authenticateUser);
router.post("/entry", Entry);
router.post("/signup", Signup);
router.post("/login",Login);
router.post("/",userVerification);
router.post("/savemessages",saveMessages,authenticateUser);
module.exports = router;