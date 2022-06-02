// package
const router = require("express").Router();

// controllers
const { loginUser, signUpUser } = require("../controller/account");

// routes

// login using username and password credentials
router.post("/login", loginUser);

// sign up and save username and password
router.post("/sign-up", signUpUser);

// export
module.exports = router;
