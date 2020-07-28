const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        maxlength: 64,
        unique: true
    },
    video: {
        type: String,
        default: "",
        required: true
    },
    courseId: Schema.Types.ObjectId,
    length: {
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        trim: true,
        default: ""
    },
}, { timestamps: true });

module.exports = mongoose.model("Video", videoSchema);