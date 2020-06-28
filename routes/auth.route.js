const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { login, logout, signup, isLoggedIn } = require("../controllers/auth.controller");

// Signup route with validations on entry level
router.post("/signup", [
    check("fullname", "Name should be atleast 3 chars.").isLength({ min: 3 }),
    check("email", "Email is Invalid.").isEmail(),
    check("password", "Password should be atleast 8 chars.").isLength({ min: 8 })
], signup);

router.post("/login", [
    check("email", "Email is Invalid.").isEmail(),
    check("password", "Password should be atleast 8 chars.").isLength({ min: 8 })
], login);

router.get("/logout", logout);

// Just testing Protected Route that checks if user isLoggedIn
router.get("/test", isLoggedIn, (req, res) => {
    // req.auth gives _id of User, cz it's in token
    res.json(req.auth._id)
});

module.exports = router;