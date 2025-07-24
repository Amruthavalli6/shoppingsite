const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true }, // full URL string expected
  category: [{ type: String }],
  price: { type: String }, // e.g. "$59.99" or "₹59.99"
  isTrending: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
