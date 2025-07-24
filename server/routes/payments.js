const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// GET saved payment methods
router.get('/:userId', async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ UPDATED: Save payment method with structured data
router.post('/', async (req, res) => {
  try {
    const { userId, type, paymentDetails } = req.body;

    let lastFour = '0000';
    let details = {};

    if (type === 'Credit/Debit Card' && paymentDetails) {
      // Mask card number for security
      const cardNumber = paymentDetails.number || '';
      lastFour = cardNumber.slice(-4);
      details = {
        cardType: 'credit/debit',
        expiry: paymentDetails.expiry,
        nameOnCard: paymentDetails.name,
        maskedNumber: `**** **** **** ${lastFour}`
      };
    } else if (type === 'UPI' && paymentDetails) {
      details = {
        upiId: paymentDetails.upi
      };
    } else if (type === 'Razorpay' && paymentDetails) {
      details = {
        razorpayPaymentId: paymentDetails.razorpayPaymentId,
        razorpayOrderId: paymentDetails.razorpayOrderId,
        status: paymentDetails.status,
        method: 'razorpay'
      };
      lastFour = 'RZPY'; // Special identifier for Razorpay
    } else if (type === 'Cash On Delivery') {
      details = {
        method: 'cod'
      };
    }

    const payment = new Payment({
      userId,
      type,
      lastFour,
      details
    });

    const saved = await payment.save();
    console.log('Payment method saved:', saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error('Payment save error:', err);
    res.status(500).json({ error: 'Failed to save payment method' });
  }
});

module.exports = router;
