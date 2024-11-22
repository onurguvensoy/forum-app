const e = require("express");
const { Signup,Login,Entry,getAllEntries,getCurrentlyUsername} = require("../Controllers/AuthController");
const router = require("express").Router();
const {userVerification,authenticateUser} = require("../Middlewares/AuthMiddlewares")
router.get("/getusername",authenticateUser,getCurrentlyUsername);
router.get("/entries", getAllEntries);
router.post("/entry", Entry);
router.post("/signup", Signup);
router.post("/login",Login);
router.post("/",userVerification);
module.exports = router;