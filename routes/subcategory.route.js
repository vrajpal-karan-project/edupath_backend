const express = require("express");
const router = express.Router();
const { getSubcategoryById, createSubcategory, getSubcategory, updateSubcategory, removeSubcategory, getAllSubcategories } = require("../controllers/subcategory.controller");
const { getUserById } = require("../controllers/user.controller");
const { isLoggedIn, isAdmin, isAuthenticated } = require("../controllers/auth.controller");

// @params so it populates stuff in req obj
router.param("userId", getUserById);
router.param("subcategoryId", getSubcategoryById);

// @routes
// Create
router.post("/subcategory/create/:userId",
    isLoggedIn, isAuthenticated, isAdmin,
    createSubcategory);

// READ
router.get("/subcategory/:subcategoryId", getSubcategory);

// UPDATE
router.put("/subcategory/:subcategoryId/:userId",
    isLoggedIn, isAuthenticated, isAdmin,
    updateSubcategory);

// DELETE
router.delete("/subcategory/:subcategoryId/:userId",
    isLoggedIn, isAuthenticated, isAdmin,
    removeSubcategory);

// GET ALL
router.get("/subcategories", getAllSubcategories);


module.exports = router;