const fs = require("fs");
const path = require("path");
const uploads = path.join(__dirname, 'uploads');
const coursesDir = path.join(uploads, "courses");

exports.getUploadsDir = () => {
    if (!fs.existsSync(uploads)) {
        fs.mkdirSync(uploads);
        console.log("Uploads dir created:", uploads);
    }
    if (!fs.existsSync(coursesDir)) {
        fs.mkdirSync(coursesDir);
        console.log("Courses dir created:", coursesDir);
    }
    return uploads;
};

exports.getUploadsURL = req => {
    const uploadsURL = req.protocol + "://" + req.get("host");
    return uploadsURL;
};

exports.getImageURL = (req, filename) => req.protocol + "://" + req.get("host") + "/" + filename;

exports.getCourseURL = (req, filename) => req.protocol + "://" + req.get("host") + "/courses/" + filename;

// Array of Error to Object
exports.normalErrors = (errors) => {
    let obj = {};
    errors.array().map(e => obj = { ...obj, [e.param]: e.msg });
    return obj;
};

exports.extensionOf = filename => filename.substring(filename.lastIndexOf('.')) || filename;

exports.uploadPaths = {
    uploads,
    courses: coursesDir,
};

exports.removeFile = (path, filename) => {
    try {
        fs.unlinkSync(oldpath);
    } catch (err) {
        console.error("=>DELETION OF FILE ERR=>", err);
    }
};

exports.getRoleName = (role) => {
    if (role === 0) return "Student";
    if (role === 1) return "Instructor";
    if (role === 2) return "Admin";
    return "UNKNOWN";
};
