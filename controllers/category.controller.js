const Category = require("../models/category.model");
const { all } = require("../routes/category.route");
// const { check, validationResult } = require("express-validator");

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, cat) => {
        if (err || !cat) {
            return res.status(400).json({ error: "Category Not found!" });
        }
        req.category = cat;
        Category.find({ parent: id }).exec((err, subcategories) => {
            if (err) {
                console.log("NOSubs Err:", err)
                return ({ error: "NO Subcategory available" });
            }

            req.category = { ...cat.toJSON(), subcategories };
            next();
        });
    });
};

exports.getCategory = (req, res) => { return res.json(req.category); };

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    const categories = req.categories;
    const isSubcat = req.body.parent && req.body.parent.length;

    if (isSubcat) { //is SubCategory
        let parent = categories.find(cat => cat._id.toString() == req.body.parent);

        if (!parent) { //Invalid Parent ID
            return res.status(400).json({
                message: "Could not save Sub Category!",
                errors: { category: "Parent category does not Exist!" }
            });
        }
        else { //Valid Parent ID
            let cats = parent.subcategories.map(cat => cat.name.toString().toLowerCase());
            if (cats.includes(category.name.toString().toLowerCase())) {//Checks If same SubCat name exists
                return res.status(400).json({
                    message: "Could not save Sub Category!",
                    errors: { category: "Sub category already Exists" }
                });
            }
        }
    }
    else { // is Parent Category
        const parentCats = categories.map(cat => {//Returning array of parent catNames in LowerCase
            if (!cat.parent && cat.name) {
                return cat.name.toString().toLowerCase()
            }
        });
        if (parentCats.includes(category.name.toString().toLowerCase())) { //Checks If same Parent Cat name exists
            return res.status(400).json({
                message: "Could not save Category!",
                errors: { category: "Category already Exists" }
            });
        }
    }

    category.save((err, cat) => {
        if (err) {
            console.log("CAT SAVE ERR", err);
            return res.status(400).json({
                message: `Could not save ${isSubcat ? 'Sub' : ''} Category!`,
                errors: { category: `${isSubcat ? 'Sub' : ''} Category couldn't be created` },
                detail: err
            });
        }
        res.json({ category });
    });

};

exports.getCategoriesInRequest = (req, res, next) => {
    let categories = [], subcategories = [];
    Category.find().exec((err, allcats) => {
        if (err || !allcats) {
            console.log({ error: "NO Categories,This will be first category : ", err });
        }
        else {
            categories = allcats.filter(cat => !cat.parent);
            categories.forEach((cat, i) => {
                subcategories = allcats.filter(c => c.parent == cat._id);
                categories[i] = { ...cat.toJSON(), subcategories };
            });
        }
        req.categories = categories;
        next();
    });
}

exports.getAllCategories = (req, res) => {
    let categories = [], subcategories = [];
    Category.find().exec((err, allcats) => {
        if (err) {
            return res.status(400).json({ error: "NO Categories found" });
        }
        categories = allcats.filter(cat => !cat.parent);
        categories.forEach((cat, i) => {
            subcategories = allcats.filter(c => c.parent == cat._id);
            categories[i] = { ...cat.toJSON(), subcategories };
        })
        res.json(categories);
    });
};

exports.updateCategory = (req, res) => {
    const isSubcat = req.body.parent && req.body.parent.length;
    Category.findByIdAndUpdate(req.category._id,
        { $set: req.body },
        { new: true, useFindAndModify: false },
        (err, category) => {
            if (err) {
                console.log(`${isSubcat ? "Sub" : ""}Category Updation Err:`, err);
                return res.status(400).json({ error: `Failed to Update ${isSubcat ? "Sub" : ""}Category` });
            }
            res.json(category);
        }
    );
};


exports.removeCategory = (req, res) => {
    const category = req.category;
    const categories = req.categories;

    Category.find({ parent: category._id }).exec((err, subcats) => {
        if (err) {
            console.log("SubCategory find ERRoR:", err);
        }
        else {
            if (subcats && subcats.length > 0) {
                return res.status(400).json({ error: `FAILED TO DELETE CATEGORY,  Delete/update ${subcats.length} Subcategory before removing this category` });
            }
            else {
                // DELETING CAT
                Category.findById(category._id).exec((err, foundCat) => {
                    if (err) {
                        return res.status(400).json({ error: `FAILED TO DELETE UNKNOWN CATEGORY` });
                    }
                    foundCat.remove((err, cat) => {
                        if (err) {
                            console.log("CAT REMOVE ERR", err);
                            return res.status(400).json({ error: "FAILED TO DELETE CATEGORY in DB" })
                        }

                        res.json({ message: `${cat.name} was deleted` });
                    })
                });
            }
        }
    });
};