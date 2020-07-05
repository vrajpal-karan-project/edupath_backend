const fs = require("fs");
const path = require("path");
const uploads = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploads)) {
    console.log("Uploads dir created:", uploads);
    fs.mkdirSync(uploads);
}

// Array of Error to Object
exports.normalErrors = (errors) => {
    let obj = {};
    errors.array().map(e => obj = { ...obj, [e.param]: e.msg });
    return obj;
}

exports.getRoleName = (role) => {
    if (role === 0) return "Student";
    if (role === 1) return "Instructor";
    if (role === 2) return "Admin";
    return "UNKNOWN";
}

exports.extensionOf = filename => filename.substring(filename.lastIndexOf('.')) || filename;

exports.uploadPaths = {
    uploads,
    avatar: path.join(uploads, 'avatar'),
};
