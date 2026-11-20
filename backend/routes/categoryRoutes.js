const express = require('express');
const router = express.Router();
const Category = require('../models/categories');
const Product = require('../models/product');
const { verifyToken, isAdmin } = require('./userRoutes');

// Public read routes
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: "Error fetching categories", details: error.message });
    }
});

// Backend route to get products by category
router.get("/category/:categoryName", async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.categoryName });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error fetching products by category", details: error.message });
    }
});

// Admin-only write routes
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).json({ message: "Category added successfully", category: newCategory });
    } catch (error) {
        res.status(400).json({ error: "Error adding category", details: error.message });
    }
});

module.exports = router;
