const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require("../models/product");
const userRoutes = require('./userRoutes.js');
const { verifyToken, isAdmin } = userRoutes;
const mongoose = require("mongoose");

const calculateTotalPrice = async (items) => {
    let total = 0;
    for (const item of items) {
        const product = await Product.findById(item._id);
        if (product) {
            total += product.price * item.quantity;
        }
    }
    return total;
};

// Get all carts (Admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ error: "Error fetching carts", details: error.message });
    }
});

// Get cart by user ID (logged-in user can only access their own cart, admin can access any)
router.get('/user/:userId', verifyToken, async (req, res) => {
    try {
        // Check ownership: user can only access their own cart unless admin
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) {
            return res.status(403).json({ error: "Access denied. You can only access your own cart." });
        }
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error fetching cart", details: error.message });
    }
});

// Get current user's cart (convenience endpoint)
router.get('/mine', verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: "Error fetching cart", details: error.message });
    }
});


router.post('/', verifyToken, async (req, res) => {
    try {
      const { userId, items } = req.body;
  
      // Validate userId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid userId" });
      }
      
      // Check ownership: user can only modify their own cart unless admin
      if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
          return res.status(403).json({ error: "Access denied. You can only modify your own cart." });
      }
  
      let cart = await Cart.findOne({ userId: userId });
      if (!cart) {
        cart = new Cart({ userId: userId, items: [] });
      }
  
      for (const newItem of items) {
        const existingItem = cart.items.find(item => item._id.equals(newItem._id));
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          cart.items.push(newItem);
        }
      }
  
      cart.totalPrice = await calculateTotalPrice(cart.items);
      await cart.save();
      res.status(201).json({ message: "Cart updated successfully", cart });
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(400).json({ error: "Error updating cart", details: error.message });
    }
  });

// Delete cart by user ID (logged-in user can only delete their own cart, admin can delete any)
router.delete('/', verifyToken, async (req, res) => {
    try {
        const userId = req.body.userId || req.user._id.toString();
        
        // Check ownership
        if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
            return res.status(403).json({ error: "Access denied. You can only delete your own cart." });
        }
        
        const deletedCart = await Cart.findOneAndDelete({ userId });
        if (!deletedCart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        res.json({ message: "Cart deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting cart", details: error.message });
    }
});

// cartRoutes.js - replace cart items (with ownership check)
router.put("/", verifyToken, async (req, res) => {
    try {
      const { userId, items } = req.body;
      
      // Check ownership
      if (req.user.role !== 'admin' && req.user._id.toString() !== userId) {
          return res.status(403).json({ error: "Access denied. You can only modify your own cart." });
      }
  
      // Find the cart for the user and update it
      const cart = await Cart.findOneAndUpdate(
        { userId },
        { items },
        { new: true, upsert: true } // Create a new cart if it doesn't exist
      );
  
      // Recalculate total price
      cart.totalPrice = await calculateTotalPrice(cart.items);
      await cart.save();
  
      res.json(cart);
    } catch (error) {
      res.status(500).json({ error: "Failed to update cart", details: error.message });
    }
  });

module.exports = router;