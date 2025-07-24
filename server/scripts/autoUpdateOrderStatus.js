const mongoose = require('mongoose');
const Order = require('../models/order');
require('dotenv').config();

async function autoUpdateOrderStatus() {
  await mongoose.connect(process.env.MONGO_URI);

  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

  // Processing -> Shipped after 1 day
  const processingOrders = await Order.find({
    status: 'Processing',
    timestamp: { $lte: oneDayAgo }
  });
  for (const order of processingOrders) {
    order.status = 'Shipped';
    await order.save();
    console.log(`Order ${order._id} status updated to Shipped`);
  }

  // Shipped -> Delivered after 1 more day (2 days total)
  const shippedOrders = await Order.find({
    status: 'Shipped',
    timestamp: { $lte: twoDaysAgo }
  });
  for (const order of shippedOrders) {
    order.status = 'Delivered';
    await order.save();
    console.log(`Order ${order._id} status updated to Delivered`);
  }

  mongoose.disconnect();
}

autoUpdateOrderStatus(); 