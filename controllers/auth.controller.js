const User = require("../models/user.model");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken"); /*To sign the jwt token with Secret */
const expressJwt = require("express-jwt"); /* to validate JWT */

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
    let errors = validationResult(req);
    const { email, password } = req.body;
    if (!errors.isEmpty()) {
        console.log("=>LOGIN ERROR :", errors);
        return res.status(422).json({ errors: normalErrors(errors) });
    }
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            err && console.log("ERROR IN FINDING USEREMAIL", err)
            return res.status(400).json({ errors: { email: "User email Does not exist" } })
        }
        //authenticate method from userSchema
        if (!user.authenticate(password)) {
            // If Password NOT correct 
            return res.status(401).json({ errors: { password: "Email and Password Don't match" } });
        }
        // If password is correct , token is generated
        const token = jwt.sign({ _id: user._id }, process.env.SECRET);

        //put token in cookie named "token" and set expiry of 24hrs
        res.cookie("token", token, { expire: new Date(Date.now() + (24 * 60 * 60 * 1000)) });

        //Send Response to FrontEnd
        const { _id, fullname, email, role } = user;
        return res.json({ token, user: { _id, fullname, email, role } });
    })
};

exports.logout = (req, res) => {
    res.clearCookie("token");
    res.json({ message: "User Logged out" });
};

// Check if user LoggedIn for Protected routes
exports.isLoggedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"
});


// custom middlewares.
exports.isAuthenticated = (req, res, next) => {
    // req.profile obj would be set from frontend
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "ACCESS DENIED!"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role !== 2) {
        return res.status(403).json({
            error: "You are NOT ADMIN ! ACCESS DENIED"
        });
    }
    next();
};