const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Cart = require('../models/cart');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper function to generate JWT token
const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Helper function to verify JWT token and attach user
const verifyToken = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        req.user = user; // Attach full user object with role
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};

// Admin-only middleware
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access denied. Admin role required." });
    }
    next();
};

// Ownership check middleware (user can only access their own resources unless admin)
const checkOwnership = (req, res, next) => {
    if (req.user.role === 'admin' || req.user._id.toString() === req.params.id) {
        return next();
    }
    return res.status(403).json({ error: "Access denied. You can only access your own resources." });
};

// User registration
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, phone, addresses } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user (role defaults to 'user')
        const newUser = new User({ firstName, lastName, email, password: hashedPassword, phone, addresses });
        await newUser.save();

        // Assign a new cart to the user
        const newCart = new Cart({ userId: newUser._id, items: [] });
        await newCart.save();

        // Generate JWT token with role
        const token = generateToken(newUser._id, newUser.role);

        res.status(201).json({ message: "User created successfully", token, role: newUser.role });
    } catch (error) {
        res.status(500).json({ error: "Error creating user", details: error.message });
    }
});
// User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        // Generate JWT token with role
        const token = generateToken(user._id, user.role);

        // Return token, message, user ID, and role
        res.json({ 
            message: "Login successful", 
            token: token, 
            _id: user._id,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ error: "Error logging in", details: error.message });
    }
});

// Get all users (admin only)
router.get('/', verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Error fetching users", details: error.message });
    }
});

// Get user by ID (own or admin)
router.get('/:id', verifyToken, checkOwnership, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Error fetching user", details: error.message });
    }
});

// Update user (own or admin)
router.put('/:id', verifyToken, checkOwnership, async (req, res) => {
    try {
        // Prevent non-admin from changing role
        if (req.user.role !== 'admin' && req.body.role) {
            delete req.body.role;
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(400).json({ error: "Error updating user", details: error.message });
    }
});

// Delete user (admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting user", details: error.message });
    }
});

module.exports = router;
module.exports.verifyToken = verifyToken;
module.exports.isAdmin = isAdmin;