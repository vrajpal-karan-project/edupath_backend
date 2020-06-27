const User = require("../models/user.model");

exports.signup = (req, res) => {
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
}

exports.login = (req, res) => {
    res.json({ message: "Login Route is working" });
}

exports.logout = (req, res) => {
    res.json({ message: "User Logged out" });
};