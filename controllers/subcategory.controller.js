const Subcategory = require("../models/subcategory.model");
// const { check, validationResult } = require("express-validator");

exports.getSubcategoryById = (req, res, next, id) => {

    Subcategory.findById(id).exec((err, subcat) => {
        if (err) {
            return res.status(400).json({ error: "Subcategory Not found!" });
        }
        req.subcategory = subcat;
        next();
    });
};

exports.getSubcategoriesByParentId = (parentId) => {
    let subs=[];
    Subcategory.find({ parent: parentId }).exec((err, subcategories) => {
        if (err) {
            console.log("NOSubs Err:", err)
            return ({ error: "NO Subcategory available" });
        }
        return subcategories;
    });
}


exports.createSubcategory = (req, res) => {
    const subcategory = new Subcategory(req.body);
    subcategory.save((err, subcat) => {
        if (err) {
            console.log("CAT SAVE ERR", err);
            return res.status(400).json({
                message: "Could not save Subcategory!",
                errors: { subcategory: (err.name == "MongoError" && err.code === 11000) ? "Subcategory already Exists" : err.errmsg },
                detail: err
            });
        }
        res.json({ subcategory });
    });
};

exports.getSubcategory = (req, res) => {
    // 
    return res.json(req.subcategory);
};

exports.getAllSubcategories = (req, res) => {
    // 
    Subcategory.find().exec((err, subcats) => {
        if (err) {
            return res.status(400).json({ error: "NO Subcategories found" })
        }
        res.json(subcats);
    });
}

exports.updateSubcategory = (req, res) => {
    const subcategory = req.subcategory;
    subcategory.name = req.body.name;
    subcategory.parent = req.body.parent;

    subcategory.save((err, updatedCat) => {
        if (err) {
            console.log("Subcategory Updation Err:", err);
            return res.status(400).json({ error: "Failed to Update Subcategory" })
        }
        res.json(updatedCat);
    })

};

exports.removeSubcategory = (req, res) => {
    const subcategory = req.subcategory;
    subcategory.remove((err, subcat) => {
        if (err) {
            console.log("CAT REMOVE ERR", err);
            return res.status(400).json({ error: "FAILED TO DELETE Subcategory in DB", detail: err })
        }
        res.json({ message: `${subcat.name} was deleted` });
    });
};