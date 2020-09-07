const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin, isAuthenticated } = require("../controllers/auth.controller");
const { getUserById, getCurrentUser } = require("../controllers/user.controller");
const { getCategoryById, createCategory, getCategory, updateCategory, removeCategory, getCategoriesInRequest, getAllCategories } = require("../controllers/category.controller");

// @params so it populates stuff in req obj
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

// @routes
// Create
router.post("/category/create/:userId",
    isLoggedIn, getCurrentUser, isAuthenticated, isAdmin, getCategoriesInRequest,
    createCategory);

// READ
router.get("/category/:categoryId", getCategory);

// GET ALL
router.get("/categories", getAllCategories);

// UPDATE
router.put("/category/:categoryId/:userId",
    isLoggedIn, getCurrentUser, isAuthenticated, isAdmin,
    updateCategory);

// DELETE
router.delete("/category/:categoryId/:userId",
    isLoggedIn, getCurrentUser, isAuthenticated, isAdmin,
    removeCategory);

module.exports = router;