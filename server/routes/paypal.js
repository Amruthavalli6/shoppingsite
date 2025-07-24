const express = require('express');
const router = express.Router();
const razorpay = require('../config/paypal');

router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: 'order_' + Date.now(),
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created:', order.id);
    res.json({ 
      orderID: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      details: error.message 
    });
  }
});

router.post('/capture-payment', async (req, res) => {
  try {
    const { paymentId, orderId, signature } = req.body;
    
    // Verify payment signature
    const text = orderId + '|' + paymentId;
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', 'fS8yIEjoqhxLMPVm7gT6b4Nf')
      .update(text.toString())
      .digest('hex');

    if (expectedSignature === signature) {
      console.log('Razorpay payment verified:', paymentId);
      res.json({ 
        success: true, 
        transactionID: paymentId,
        status: 'completed'
      });
    } else {
      throw new Error('Invalid payment signature');
    }
  } catch (error) {
    console.error('Razorpay capture error:', error);
    res.status(500).json({ 
      error: 'Failed to capture payment',
      details: error.message 
    });
  }
});

module.exports = router; 