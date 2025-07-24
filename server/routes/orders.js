const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Get order count (must be above /:orderId and /:userId)
router.get('/count', async (req, res) => {
  try {
    const count = await Order.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get total sales (must be above /:orderId and /:userId)
router.get('/total-sales', async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);
    const totalSales = result[0]?.total || 0;
    res.json({ totalSales });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all orders (admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);  // req.body must have userId now
    await order.save();
    console.log('✅ Order placed successfully:', {
      orderId: order._id,
      userId: order.userId,
      paymentMethod: order.paymentMethod,
      total: order.total
    });
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('❌ Error placing order:', error);
    res.status(500).json({ message: 'Failed to place order', error });
  }
});

// Get orders by userId (for order history)
router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (for admin/future use)
router.put('/status/:orderId', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete order (admin)
router.delete('/:orderId', async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.orderId);
    if (!deleted) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Tracking endpoint
router.get('/:orderId/tracking', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const placed = order.timestamp;
    const processing = placed;
    const shipped = new Date(placed.getTime() + 1 * 24 * 60 * 60 * 1000);
    const delivered = new Date(placed.getTime() + 2 * 24 * 60 * 60 * 1000);
    const history = [
      { status: 'Order Placed', timestamp: placed },
      { status: 'Processing', timestamp: processing },
    ];
    if (['Shipped', 'Delivered'].includes(order.status)) {
      history.push({ status: 'Shipped', timestamp: shipped });
    }
    if (order.status === 'Delivered') {
      history.push({ status: 'Delivered', timestamp: delivered });
    }
    res.json({
      trackingNumber: order.trackingNumber,
      history
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
