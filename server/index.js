require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const { exec } = require('child_process');

const authRoutes = require('./routes/auth');           // User auth routes (login/signup)
const productRoutes = require('./routes/products');    // Product routes (list, filter)
const cartRoutes = require('./routes/cart');           // Cart routes (add/remove/fetch)
const wishlistRoutes = require('./routes/wishlist');   // Wishlist routes (add/remove/fetch)
const ordersRoute = require('./routes/orders');        // Orders routes (place order, get orders)
const userRoutes = require('./routes/users');          // User profile routes
const paymentRoutes = require('./routes/payments');    // Payment routes (get payment methods)
const paypalRoutes = require('./routes/paypal');       // PayPal payment processing routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', ordersRoute);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/paypal', paypalRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      // Schedule trending update every day at 2:00 AM
      cron.schedule('0 2 * * *', () => {
        console.log('Running trending update script...');
        exec('node server/scripts/updateTrending.js', (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
        });
      });
      // Schedule auto-update order status every day at 3:00 AM
      cron.schedule('0 3 * * *', () => {
        console.log('Running auto-update order status script...');
        exec('node server/scripts/autoUpdateOrderStatus.js', (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
        });
      });
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
