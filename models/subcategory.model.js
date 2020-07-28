const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = Schema;

const subcategorySchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true
    },
    parent: {
        type: ObjectId,
        ref: "Category"
    }
}, { timestamps: true });

module.exports = mongoose.model("Subcategory", subcategorySchema);