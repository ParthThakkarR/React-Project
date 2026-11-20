const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const Cart = require("../models/cart");
const Product = require("../models/product");
const { verifyToken } = require('./userRoutes');

// Place an order (authenticated user)
router.post("/place", verifyToken, async (req, res) => {
    try {
        // Recalculate total from cart/product prices for security
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }
        
        let totalAmount = 0;
        const orderItems = [];
        
        for (const item of cart.items) {
            const product = await Product.findById(item._id);
            if (!product) {
                return res.status(400).json({ error: `Product ${item._id} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
            }
            
            orderItems.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.price
            });
            totalAmount += product.price * item.quantity;
            
            // Decrease stock
            product.stock -= item.quantity;
            await product.save();
        }
        
        const newOrder = new Order({
            userId: req.user._id,
            items: orderItems,
            totalAmount,
            orderStatus: 'pending',
            createdAt: new Date()
        });
        
        await newOrder.save();
        
        // Clear the cart after successful order
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();
        
        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ error: "Failed to place order", details: error.message });
    }
});

// Get orders by user ID (own orders or admin)
router.get("/:userId", verifyToken, async (req, res) => {
    try {
        // Check ownership
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) {
            return res.status(403).json({ error: "Access denied. You can only view your own orders." });
        }
        
        const orders = await Order.find({ userId: req.params.userId });
        if (orders.length === 0) {
            return res.status(404).json({ error: "No orders found for this user" });
        }
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders", details: error.message });
    }
});

// Get all orders (admin only)
router.get("/", verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied. Admin role required." });
        }
        const orders = await Order.find().populate('userId', 'firstName lastName email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch orders", details: error.message });
    }
});

// Update order status (admin only)
router.put("/:orderId/status", verifyToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: "Access denied. Admin role required." });
        }
        
        const { orderStatus } = req.body;
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ error: "Invalid order status" });
        }
        
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { orderStatus },
            { new: true }
        );
        
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        
        res.json({ message: "Order status updated", order });
    } catch (error) {
        res.status(500).json({ error: "Failed to update order status", details: error.message });
    }
});

module.exports = router;


