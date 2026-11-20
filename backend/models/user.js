const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: Number,
    addresses: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);