const User = require("../models/user.model");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken"); /*To sign the jwt token with Secret */
const expressJwt = require("express-jwt"); /* to validate JWT */
const { normalErrors, getRoleName } = require("../helper");
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');


// gets User By Id and places in req.profile and continues to next middleware
exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: "USER NOT FOUND!" });
        }
        req.profile = user;
        next();
    });
};

// LoggedIn user Account from id from token, using only in update reqs 
exports.getCurrentUser = (req, res, next) => {
    User.findById(req.auth._id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: "USER NOT FOUND!" });
        }
        user.salt = undefined;
        user.enc_password = undefined;
        req.myAccount = user;
        next();
    });
};

// returns req.profile as response
exports.getUser = (req, res) => {
    // below line for NOt sending sensitive data, so when fethcing /user/:id it doesnot sent it 
    req.profile.salt = undefined;
    req.profile.enc_password = undefined;
    return res.json(req.profile);
};


exports.getAllUsers = (req, res) => {
    User.find().exec((err, users) => {
        if (err || !users) {
            return res.status(400).json({ error: "Users not found!" });
        }
        return res.json(users);
    });
};

exports.getUsersByRole = (req, res) => {
    const { role } = req.params;
    User.find({ role }).exec((err, users) => {
        if (err || !users || !users.length) {
            return res.status(400).json({ error: `Users of ${getRoleName(role)} role not found!` });
        }
        return res.json(users);
    });
};

const securePassword = (user) => {
    user.salt = uuidv4();
    user.enc_password = crypto.createHmac('sha256', user.salt)
        .update(user.password)
        .digest("hex");
    return user;
};


exports.updateUser = (req, res) => {
    const errors = validationResult(req);
    const isPasswordReq = req.body && req.body.password && req.body.password.length;
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: normalErrors(errors) });
    }
    /* https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate*/
    /* req.body.password.length ? securePassword(req.body) : req.body// If there exists password in request then use update password code  */
    User.findByIdAndUpdate({ _id: req.profile._id },
        { $set: isPasswordReq ? securePassword(req.body) : req.body },
        { new: true, useFindAndModify: false },
        (err, user) => {
            if (err) {
                return res.status(400).json({ error: "NOT Authorized to Update" });
            }

            const token = jwt.sign({ _id: user._id }, process.env.SECRET);

            //put token in cookie named "token" and set expiry of 24hrs
            res.cookie("token", token, { expire: new Date(Date.now() + (24 * 60 * 60 * 1000)) });
    
            //Send Response to FrontEnd
            const { _id, fullname, email, about, avatar, role } = user;
    
             res.json({ token, user: { _id, fullname, email, about, avatar, role } });
            // res.json(user);
        }
    );
};