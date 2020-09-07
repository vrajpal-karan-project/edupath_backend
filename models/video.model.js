const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Course = require("./course.model");

const videoSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        minlength: 20,
        maxlength: 80,
        unique: true
    },
    video: {
        type: String,
        trim: true,
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

videoSchema.post("remove", document => {
    const vdoId = document._id;
    Course.find({ videos: { $in: [vdoId] } }).then(courses => {
        Promise.all(
            courses.map(course =>
                Course.findOneAndUpdate(
                    course._id,
                    { $pull: { videos: vdoId } },
                    { new: true }
                )
            )
        );
    });
});

module.exports = mongoose.model("Video", videoSchema);