const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Added userId
  address: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  paymentDetails: { type: Object, default: {} }, // Store payment details like Razorpay info
  items: [
    {
      productId: { type: String },
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, default: 'Processing' }, // Shipping status
  timestamp: { type: Date, default: Date.now },
  trackingNumber: { type: String, default: () => Math.random().toString(36).substring(2, 12).toUpperCase() },
});

module.exports = mongoose.model('Order', orderSchema);
