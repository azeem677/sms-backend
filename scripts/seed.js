const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');

dotenv.config();

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Check if user exists
        const existingUser = await User.findOne({ email: 'admin@example.com' });
        if (existingUser) {
            console.log('Admin user already exists.');
            process.exit();
        }

        await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'adminpassword123',
            role: 'admin'
        });

        console.log('Default Admin User Created!');
        console.log('Email: admin@example.com');
        console.log('Password: adminpassword123');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUser();
