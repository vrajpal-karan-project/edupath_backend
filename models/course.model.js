const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({

//     title* : String,
//     author: USerID,
//     price*: float,
//     discount: float(%) Default: 0 % ,
//     students: [userID, ...],
//     category*: categoryID,
//     description* : String
//      level: String(ALL, BEGINNER, INTERMEDIATE, EXPERT),
//     requirements: String,
//     status: String(REGISTERED, ACCEPTED:default, PENDING, REQUESTED)
//     videos: [videoId],
//     featured: Boolean
//     thumbnail: String(location of thumbnail),
//         length : Number(miutes),

//         title: {
//             type: String,
//             trim: true,
//             required: true,
//             maxlength: 100
//         },
//         author:type:Schema.Types.ObjectId,
//         price:{

//         }
        ]
        video: [{type:Schema.Types.ObjectId,ref:"Video"}],
       
        length: {
            type: Number,
            default: 0
        },
        description: {
            type: String,
            trim: true,
            default: ""
        },

}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);