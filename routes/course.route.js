const express = require("express");
const router = express.Router();
const { getUserById } = require("../controllers/user.controller");
const { check, validationResult } = require("express-validator");
const { isLoggedIn, isAdmin, isInstructor, isAuthenticated, isAuthor } = require("../controllers/auth.controller");
const { getCourseById, getCourse, getAllCourses, registerCourse, updateCourse, deleteCourse, parseForm } = require("../controllers/course.controller");

// @params so it populates stuff in req obj
router.param("userId", getUserById);
router.param("courseId", getCourseById);

router.get("/course/:courseId", getCourse);

router.get("/courses", getAllCourses);

// register course
router.post("/course/register/:userId", isLoggedIn, isAuthenticated, isInstructor, [
    check("title", "Title should be atleast 20 chars.").isLength({ min: 20 }),
    check("description", "Description should be atleast 20 chars.").isLength({ min: 20 })
],
    registerCourse);

router.put("/course/:courseId/:userId", isLoggedIn, isAuthenticated, isInstructor, isAuthor, [
    check("title", "Title should be atleast 20 chars.").isLength({ min: 20 }),
    check("description", "Description should be atleast 20 chars.").isLength({ min: 20 })
],parseForm, updateCourse);

router.delete("/course/:courseId/:userId", isLoggedIn, isAuthenticated, isInstructor, isAuthor,
    deleteCourse);

module.exports = router;