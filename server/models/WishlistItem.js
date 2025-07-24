const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: String, required: true },
  title: String,
  image: String,
  price: Number
}, { timestamps: true });

module.exports = mongoose.model('WishlistItem', wishlistItemSchema);
