const { Router } = require("express");
const { login, signup, verifyUser, getUsername } = require("../Controllers/AuthController");
const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify", verifyUser);
router.get("/getusername", getUsername);

module.exports = router;