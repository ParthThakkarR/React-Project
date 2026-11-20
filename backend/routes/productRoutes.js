const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { verifyToken, isAdmin } = require('./userRoutes');

// Public read routes
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Error fetching products", details: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: "Error fetching product", details: error.message });
    }
});

router.get("/category/:categoryName", async (req, res) => {
    try {
        const categoryName = req.params.categoryName;
        const products = await Product.find({ category: categoryName });
        res.json(products);
    } catch (error) {
        console.error("Error fetching products by category:", error);
        res.status(500).json({ error: "Failed to fetch products by category" });
    }
});

// Admin-only write routes
router.post('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(400).json({ error: "Error adding product", details: error.message });
    }
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(400).json({ error: "Error updating product", details: error.message });
    }
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting product", details: error.message });
    }
});

module.exports = router;

