const Category = require("../models/category.model");
// const { check, validationResult } = require("express-validator");

exports.getCategoryById = (req, res, next, id) => {

    Category.findById(id).exec((err, cat) => {
        if (err) {
            return res.status(400).json({ error: "Category Not found!" });
        }
        req.category = cat;
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
    // 
    return res.json(req.category);
};

exports.getAllCategories = (req, res) => {
    // 
    Category.find().exec((err, cats) => {
        if (err) {
            return res.status(400).json({ error: "NO Categories found" })
        }
        res.json(cats);
    });
}

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
    category.remove((err, cat) => {
        if (err) {
            console.log("CAT REMOVE ERR", err);
            return res.status(400).json({ error: "FAILED TO DELETE CATEGORY in DB", detail: err })
        }
        res.json({ message: `${cat.name} was deleted` });
    });
};