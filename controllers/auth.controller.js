const User = require("../models/user.model");
const { check, validationResult } = require("express-validator");

// Array of Error to Object 
const normalErrors = (errors) => {
    let obj = {};
    errors.array().map(e => obj = { ...obj, [e.param]: e.msg });
    return obj;
}

exports.signup = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log("=>SIGNUP ERROR", errors);
        return res.status(422).json({
            errors: normalErrors(errors)
            // error: errors.array()[0].msg,
            // param: errors.array()[0].param
        });
    }
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            console.error("ERROR IN SAVE", err);
            return res.status(400).json({
                message: "could not save User",
                errors: { email: (err.name == "MongoError" && err.code === 11000) ? "Email already Exists" : err.errmsg }
            });
        }
        res.json(user._id);
    });
};


exports.login = (req, res) => {
    res.json({ message: "Login Route is working" });
}

exports.logout = (req, res) => {
    res.json({ message: "User Logged out" });
};