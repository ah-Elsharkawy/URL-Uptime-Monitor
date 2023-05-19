const express = require("express");
const router = express.Router();
const validateSignupData = require("../middleware/signupValidatorMW");
const validateLoginData = require("../middleware/loginValidatorMW");
const { signup, login } = require("../controllers/authController");

// Signup
router.post("/signup", validateSignupData, signup);

// Login
router.post("/login", validateLoginData, login);

module.exports = router;