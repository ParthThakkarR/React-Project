const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const { verifyToken, isAdmin } = require('./userRoutes');

// Public read routes
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: "Error fetching reviews", details: error.message });
    }
});

router.get('/product/:id', async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.id });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: "Error fetching reviews", details: error.message });
    }
});

// Authenticated user can add a review
router.post('/', verifyToken, async (req, res) => {
    try {
        const newReview = new Review({
            ...req.body,
            userId: req.user._id
        });
        await newReview.save();
        res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (error) {
        res.status(400).json({ error: "Error adding review", details: error.message });
    }
});

// Delete a review (owner or admin)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        
        // Check ownership
        if (req.user.role !== 'admin' && review.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Access denied. You can only delete your own reviews." });
        }
        
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting review", details: error.message });
    }
});

module.exports = router;
