const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/question-paper-gen';

const createAdmin = async () => {
    try {
        console.log(`Connecting to: ${MONGO_URI}`);
        await mongoose.connect(MONGO_URI);
        console.log('Successfully connected to MongoDB.');

        // Check current database name
        const dbName = mongoose.connection.name;
        console.log(`Target Database: ${dbName}`);

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log(`Admin user '${existingAdmin.email}' already exists in database '${dbName}'.`);
            const allUsers = await User.find({}).select('email role status');
            console.log('Current Users in DB:', allUsers);
            process.exit(0);
        }

        console.log('No admin found. Creating super admin...');
        const adminData = {
            name: 'System Administrator',
            email: 'admin@institution.edu',
            password: 'AdminPassword123!',
            passwordConfirm: 'AdminPassword123!',
            role: 'admin',
            status: 'Active'
        };

        const newAdmin = await User.create(adminData);
        console.log('Admin user created successfully!');
        
        const verification = await User.findById(newAdmin._id);
        if (verification) {
            console.log('Verification: Admin account found in DB after creation.');
        }

        console.log('--------------------------------------------------');
        console.log('SUCCESS: System Administrator account is now LIVE.');
        console.log('Email: admin@institution.edu');
        console.log('Password: AdminPassword123!');
        console.log('--------------------------------------------------');

        process.exit(0);
    } catch (err) {
        console.error('FATAL ERROR DURING SEEDING:', err);
        process.exit(1);
    }
};

createAdmin();
