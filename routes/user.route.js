const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { isLoggedIn, isAuthenticated, verifyOldPassword } = require("../controllers/auth.controller");
const { getUserById, getUser, getAllUsers, updateUser, getUsersByRole, getCurrentUser } = require("../controllers/user.controller");


/* Whenever "userID" param is present in the route gets UserById and puts the response in request Obj, i.e-req.profile*/
router.param("userId", getUserById);

router.get("/user/:userId", isLoggedIn, isAuthenticated, getUser);

router.put("/user/:userId", isLoggedIn, getCurrentUser, isAuthenticated,
    [check("fullname", "Name should be  atleast 3 chars").isLength({ min: 3 }),
    check("email", "Email Invalid").isEmail()], updateUser);

router.put("/user/password/:userId", isLoggedIn, getCurrentUser, isAuthenticated,
    [check("password", "Password should be atleast 8 chars.").isLength({ min: 8 })], verifyOldPassword, updateUser);

router.get("/users", isLoggedIn, getAllUsers);

router.get("/users/:role", isLoggedIn, getUsersByRole);

module.exports = router;