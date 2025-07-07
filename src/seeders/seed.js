
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/user');
const Product = require('../models/product');
const Category = require('../models/category');

const seedDB = async () => {
  await connectDB();
  await User.deleteMany({});
  await Product.deleteMany({});
  await Category.deleteMany({});

  const categories = await Category.insertMany([
    { name: 'Electronics' },
    { name: 'Clothing' }
  ]);

  await Product.insertMany([
    {
      name: 'Smartphone',
      description: 'Latest model with 128GB storage',
      price: 599.99,
      stock: 100,
      categoryId: categories[0]._id,
      imageUrl: 'https://example.com/smartphone.jpg'
    },
    {
      name: 'T-Shirt',
      description: 'Comfortable cotton t-shirt',
      price: 19.99,
      stock: 200,
      categoryId: categories[1]._id,
      imageUrl: 'https://example.com/tshirt.jpg'
    }
  ]);

  await User.create({
    name: 'Roeun Chanthou',
    email: 'test@example.com',
    password: 'password123'
  });

  console.log('Database seeded');
  process.exit();
};

seedDB();