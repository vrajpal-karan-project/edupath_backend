const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const { ObjectId } = Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 32
    },
    parent: String
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);