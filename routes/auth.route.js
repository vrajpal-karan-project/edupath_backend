const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const { login, signup, logout } = require("../controllers/auth.controller");

// Signup route with validations on entry level
router.post("/signup", [
    check("fullname", "Name should be atleast 3 chars.").isLength({ min: 3 }),
    check("email", "Email is Invalid.").isEmail(),
    check("password", "password should be atleast 8 chars.").isLength({ min: 8 })
], signup);

router.post("/login", login);

router.get("/logout", logout);

module.exports = router;
