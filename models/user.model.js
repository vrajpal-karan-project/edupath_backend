const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    fullname: {
        type: String,
        required: true,
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    enc_password: {
        type: String,
        required: true
    },
    salt: String,
    about: {
        type: String,
        trim: true,
        default: ""
    },
    role: {
        type: Number,
        default: 0 /* 0-Student, 1-Instructor, 2-Admin */
    },
    enrolled_courses: [{
        type: Schema.Types.ObjectId,
        ref: "Course",
        default: []
    }],
    published_courses: [{
        type: Schema.Types.ObjectId,
        ref: "Course",
        default: []
    }],
}, { timestamps: true });


// Sets Randomly salted Encrypted password
userSchema.virtual("password").set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.enc_password = this.securePassoword(password);
}).get(function () { return this._password; });


// Custom Document Instance Methods [Don't Use Arrow fxn, cuz we need "this" to access to the document]
userSchema.methods = {

    authenticate: function (plainPassowrd) {
        return this.securePassoword(plainPassowrd) === this.enc_password;
    }
    ,
    securePassoword: function (plainPassowrd) {
        if (!plainPassowrd) return "";
        try {
            return crypto.createHmac('sha256', this.salt)
                .update(plainPassowrd)
                .digest("hex");
        } catch (err) {
            return "";
        }
        //returning "" empty string would cause error,
        // cuz password field is required therefore mongoDB will handle that thing by itself
    }
}

module.exports = mongoose.model("User", userSchema);