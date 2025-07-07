// src/controllers/paymentController.js
const Payment = require('../models/payment');
const Order = require('../models/order');
const { io } = require('../sockets/socket');

exports.createPayment = async (req, res) => {
  try {
    const { orderId, amount, method, transactionId } = req.body;
    const order = await Order.findById(orderId);
    if (!order || order.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const payment = await Payment.create({
      orderId,
      amount,
      method, // e.g., "Stripe", "PayPal"
      status: 'completed', // Update based on payment gateway response
      transactionId
    });
    await Order.findByIdAndUpdate(orderId, { status: 'processing' });
    io.to(`user:${req.user._id}`).emit('payment:confirmed', payment);
    res.status(201).json({ message: 'Payment recorded', payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPaymentByOrder = async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment || payment.orderId.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};