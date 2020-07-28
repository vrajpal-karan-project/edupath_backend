const Category = require("../models/category.model");
const Subcategory = require("../models/subcategory.model");
// const { check, validationResult } = require("express-validator");
const { getSubcategoriesByParentId } = require("./subcategory.controller");

exports.getCategoryById = (req, res, next, id) => {

    Category.findById(id).exec((err, cat) => {
        if (err) {
            return res.status(400).json({ error: "Category Not found!" });
        }
        req.category = cat;
    });
    Subcategory.find({ parent: id }).exec((err, subcategories) => {
        if (err) {
            console.log("NOSubs Err:", err)
            return ({ error: "NO Subcategory available" });
        }
        req.category = { subcategories, ...req.category.toJSON() };
        next();
    });
};

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, cat) => {
        if (err) {
            console.log("CAT SAVE ERR", err);
            return res.status(400).json({
                message: "Could not save Category!",
                errors: { category: (err.name == "MongoError" && err.code === 11000) ? "Category already Exists" : err.errmsg },
                detail: err
            });
        }
        res.json({ category });
    });
};

exports.getCategory = (req, res) => {
    return res.json(req.category);
};

exports.getAllCategories = (req, res) => {
    let categories = [], subcategories = [];
    Category.find().exec((err, cats) => {
        if (err) {
            return res.status(400).json({ error: "NO Categories found" });
        }
        res.json(cats);
    });
};

exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;

    category.save((err, updatedCat) => {
        if (err) {
            console.log("Category Updation Err:", err);
            return res.status(400).json({ error: "Failed to Update Category" })
        }
        res.json(updatedCat);
    })

};


exports.removeCategory = (req, res) => {
    const category = req.category;
    Subcategory.find({ parent: category._id }).exec((err, prods) => {
        if (err) {
            console.log("SubCategory find ERRoR:", err);
        }
        else {
            if (prods && prods.length > 0) {
                return res.status(400).json({ error: `FAILED TO DELETE CATEGORY,  Delete/update ${prods.length} Subcategory before removing this category` });
            }
            else {
                // DELETING CAT
                category.remove((err, cat) => {
                    if (err) {
                        console.log("CAT REMOVE ERR", err);
                        return res.status(400).json({ error: "FAILED TO DELETE CATEGORY in DB" })
                    }

                    res.json({ message: `${cat.name} was deleted` });
                })
            }
        }
    });
};