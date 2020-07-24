const express = require("express");
const router = express.Router();
const { getCategoryById, createCategory, getCategory, updateCategory, removeCategory, getAllCategories } = require("../controllers/category.controller");
const { getUserById } = require("../controllers/user.controller");
const { isLoggedIn, isAdmin, isAuthenticated } = require("../controllers/auth.controller");

// @params so it populates stuff in req obj
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

// @routes
// Create
router.post("/category/create/:userId",
    isLoggedIn, isAuthenticated, isAdmin,
    createCategory);

// READ
router.get("/category/:categoryId", getCategory);

// UPDATE
router.put("/category/:categoryId/:userId",
    isLoggedIn, isAuthenticated, isAdmin,
    updateCategory);

// DELETE
router.delete("/category/:categoryId/:userId",
    isLoggedIn, isAuthenticated, isAdmin,
    removeCategory);

// GET ALL
router.get("/categories", getAllCategories);


module.exports = router;