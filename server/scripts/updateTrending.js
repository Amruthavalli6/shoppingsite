require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/order');

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('❌ MONGO_URI not defined in env!');
  process.exit(1);
}

async function updateTrendingProducts() {
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB');

  // Check if there are any orders
  const orderCount = await Order.countDocuments();
  
  if (orderCount === 0) {
    console.log('📊 No orders found. Setting first 3 products as trending...');
    await Product.updateMany({}, { $set: { isTrending: false } });
    // Get the first 3 products
    const firstThree = await Product.find({}).sort({ _id: 1 }).limit(3);
    const trendingIds = firstThree.map(p => p._id);
    await Product.updateMany({ _id: { $in: trendingIds } }, { $set: { isTrending: true } });
    console.log('✅ Trending products set (no orders):', firstThree.map(p => p.title));
  } else {
    console.log('📊 Orders found. Updating trending based on sales...');
    // Aggregate sales count for each product
    const sales = await Order.aggregate([
      { $unwind: '$items' },
      { $group: {
          _id: '$items.productId',
          totalSold: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 3 }
    ]);
    const trendingIds = sales.map(s => new mongoose.Types.ObjectId(String(s._id)));
    await Product.updateMany({}, { $set: { isTrending: false } });
    const updated = await Product.updateMany({ _id: { $in: trendingIds } }, { $set: { isTrending: true } });
    const trendingProducts = await Product.find({ _id: { $in: trendingIds } });
    console.log('✅ Trending products updated based on sales:', trendingProducts.map(p => p.title));
    console.log('Matched:', updated.matchedCount, 'Modified:', updated.modifiedCount);
  }
  mongoose.connection.close();
}

updateTrendingProducts().catch(err => {
  console.error('❌ Error updating trending products:', err);
  mongoose.connection.close();
}); 