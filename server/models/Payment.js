const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: String,           // e.g. Credit Card, UPI
  lastFour: String,       // Last 4 digits of card number
  details: Object         // Optional extra details
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
