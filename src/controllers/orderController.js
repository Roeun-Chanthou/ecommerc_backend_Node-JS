const Order = require("../models/order");
const OrderItem = require("../models/orderItem");
const Product = require("../models/product");
const { io } = require("../sockets/socket");

exports.createOrder = async (req, res) => {
  try {
    const { items, total } = req.body;
    const userId = req.user._id;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return res
          .status(400)
          .json({
            error: `Product ${item.productId} unavailable or insufficient stock`,
          });
      }
    }

    const order = await Order.create({
      userId,
      total,
      status: "pending",
    });

    for (const item of items) {
      await OrderItem.create({
        orderId: order._id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // Broadcast real-time events
    io.to(`user:${userId}`).emit("order:placed", order);
    io.emit("stock:updated", { productIds: items.map((i) => i.productId) });

    res.status(201).json({ message: "Order placed", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate({
      path: "orderItems",
      populate: { path: "productId" },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: "orderItems",
      populate: { path: "productId" },
    });
    if (!order || order.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
