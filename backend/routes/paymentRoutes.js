const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');
const Order = require('../models/order');
const { verifyToken, isAdmin } = require('./userRoutes');

// All payment routes require authentication
router.use(verifyToken);

// Get all payments (admin only)
router.get('/', isAdmin, async (req, res) => {
    try {
        const payments = await Payment.find();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: "Error fetching payments", details: error.message });
    }
});

// Get payment by order ID (owner or admin)
router.get('/:orderId', async (req, res) => {
    try {
        const payment = await Payment.findOne({ orderId: req.params.orderId });
        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }
        
        // Check if user owns the order or is admin
        const order = await Order.findById(payment.orderId);
        if (!order) {
            return res.status(404).json({ error: "Associated order not found" });
        }
        
        if (req.user.role !== 'admin' && order.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Access denied" });
        }
        
        res.json(payment);
    } catch (error) {
        res.status(500).json({ error: "Error fetching payment", details: error.message });
    }
});

// Add a new payment (admin only - typically called by payment webhook)
router.post('/', isAdmin, async (req, res) => {
    try {
        const newPayment = new Payment(req.body);
        await newPayment.save();
        res.status(201).json({ message: "Payment recorded successfully", payment: newPayment });
    } catch (error) {
        res.status(400).json({ error: "Error recording payment", details: error.message });
    }
});

// Delete payment by order ID (admin only)
router.delete('/:orderId', isAdmin, async (req, res) => {
    try {
        const deletedPayment = await Payment.findOneAndDelete({ orderId: req.params.orderId });
        if (!deletedPayment) {
            return res.status(404).json({ error: "Payment not found" });
        }
        res.json({ message: "Payment deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting payment", details: error.message });
    }
});

module.exports = router;
