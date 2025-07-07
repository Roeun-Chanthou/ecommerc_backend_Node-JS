// src/app.js
const express = require('express');
const connectDB = require('./config/db');

const app = express();
connectDB();

app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/product'));
app.use('/api/categories', require('./routes/category'));
app.use('/api/carts', require('./routes/cart'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/payments', require('./routes/payment'));

module.exports = app;