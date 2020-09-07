const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({

    //     title* : String,
    //     author: USerID,
    //     price*: float,
    //     discount: float(%) Default: 0 % ,
    //     students: [userID, ...],
    //     category*: categoryID,
    //     subcategory*: subcategoryId,
    //     description* : String
    //     level: String(ALL, BEGINNER, INTERMEDIATE, EXPERT),
    //     requirements: String,
    //     status: String(REGISTERED, ACCEPTED:default, PENDING, REQUESTED)
    //     videos: [videoId],
    //     featured: Boolean
    //     thumbnail: String(location of thumbnail),
    //     length : Number(miutes),
    title: {
        type: String,
        trim: true,
        required: true,
        minlength:20,
        maxlength: 150
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    videos: [{
        type: Schema.Types.ObjectId,
        ref: "Video"
    }],
    students: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    subcategory: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Subcategory"
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength:1000,
        default: ""
    },
    price: {
        type: mongoose.Types.Decimal128,
        required: true,
        default: 0
    },
    discount: {
        type: mongoose.Types.Decimal128,
        default: 0
    },
    thumbnail: {
        type: String,
        trim: true,
        default: ""
    },
    level: {
        type: String,
        required: true
    },
    requirement: {
        type: String
    },
    status: {
        type: String,
        default: "ACCEPTED"
    },
    featured: {
        type: Boolean,
        default: false
    },
    length: {
        type: Number,
        default: 0
    },

}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);