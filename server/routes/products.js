const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products or filter by category (case insensitive partial match)
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;

    let filter = {};
    if (category) {
      // Use $in with regex for robust, case-insensitive matching in category arrays
      filter.category = { $in: [new RegExp(category, 'i')] };
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET trending products (limit 3)
router.get('/trending', async (req, res) => {
  try {
    const trendingProducts = await Product.find({ isTrending: true }).limit(3);
    res.json(trendingProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
