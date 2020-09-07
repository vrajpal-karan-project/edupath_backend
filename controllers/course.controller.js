const Course = require("../models/course.model.js");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const formidable = require("formidable");
const { check, validationResult } = require("express-validator");
const { normalErrors, getRoleName, uploadPaths, status, extensionOf, getImageURL, getCourseURL, removeFile } = require("../helper");

exports.getCourseById = (req, res, next, id) => {
    Course.findById(id).exec((err, course) => {
        if (err || !course) {
            return res.status(400).json({ error: "COURSE NOT FOUND!" });
        }
        req.course = course;
        next();
    });
};
exports.getCourse = (req, res) => {
    return res.json(req.course);
};

exports.getAllCourses = (req, res) => {
    Course.find().exec((err, courses) => {
        if (err || !courses) {
            return res.status(400).json({ error: "COURSES not found!" });
        }
        return res.json(courses);
    });
}

exports.registerCourse = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: normalErrors(errors) });
    }
    const course = new Course(req.body);
    course.status = status.registered;
    course.save((err, savedCourse) => {
        if (err) {
            console.log("Course SAVE ERR", err);
            return res.status(400).json({
                message: "Could not save Course!",
                // errors: { course: (err.name == "MongoError" && err.code === 11000) ? "Course already Exists" : err.errmsg },
                detail: err.message
            });
        }
        //creating dir for new course
        const courseDir = path.join(uploadPaths.courses, savedCourse._id.toString());
        if (!fs.existsSync(courseDir)) {
            fs.mkdirSync(courseDir);
            console.log("new course dir created:", courseDir);
        }
        res.json({ savedCourse });
    });
};

exports.parseForm = (req, res, next) => {
    const courseDir = path.join(uploadPaths.courses, req.course._id.toString());
    let form = new formidable.IncomingForm({ uploadDir: courseDir, captureRejections: true, keepExtensions: true });
    form.multiples = true;


};

// exports.uploadCourse()

exports.updateCourse = () => {

};

exports.deleteCourse = () => {

};