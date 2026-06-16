require('dotenv').config();
const mongoose = require('mongoose');
const users = require('./data/users');
const products = require('./data/products');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const importData = async () => {
  try {
    // Clear existing collections
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Insert users using User.create so password hashing pre-save hook runs
    const createdUsers = await User.create(users);

    // Get the ID of the Admin user to associate with mock products
    const adminUser = createdUsers[0]._id;

    // Associate the admin user ID with each product
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    // Insert products
    await Product.insertMany(sampleProducts);

    console.log('Data Imported Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    // Clear all collections
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error with data destruction: ${error.message}`);
    process.exit(1);
  }
};

// Check CLI arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  destroyData();
} else {
  console.log('Please run with argument -i (import) or -d (destroy)');
  process.exit(1);
}
