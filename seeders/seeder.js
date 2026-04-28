// seeder.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import User from './models/userModel.js';

dotenv.config();

// Sample data

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: '123456', 
    role: "admin",
  },
  {
    name: 'midhun',
    email: 'midhun@example.com',
    password: '123456',
    role:"user",
  },
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany();

  
    await User.insertMany(users);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Run with: node seeder.js -import OR node seeder.js -destroy
if (process.argv[2] === '-import') {
  importData();
} else if (process.argv[2] === '-destroy') {
  destroyData();
}
