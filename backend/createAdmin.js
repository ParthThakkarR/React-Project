const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config();

const User = require('./models/user');

async function createAdmin() {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI environment variable is missing in .env");
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB.");

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log("Admin user already exists.");
            // Update role to admin if not already
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log("Updated existing user to admin role.");
            }
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Create admin user
        const adminUser = new User({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            password: hashedPassword,
            phone: 9999999999,
            addresses: 'Admin Office',
            role: 'admin'
        });

        await adminUser.save();
        console.log("Admin user created successfully!");
        console.log("Email: admin@example.com");
        console.log("Password: admin123");
        console.log("Role: admin");

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exit(1);
    }
}

createAdmin();