const express = require('express');
const WishlistItem = require('../models/WishlistItem');
const router = express.Router();

// Toggle wishlist item
router.post('/', async (req, res) => {
  const { userId, productId, title, image, price } = req.body;
  try {
    const existing = await WishlistItem.findOne({ userId, productId });
    if (existing) {
      await WishlistItem.deleteOne({ userId, productId });
      return res.status(200).json({ removed: true });
    }
    const item = new WishlistItem({ userId, productId, title, image, price });
    await item.save();
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's wishlist
router.get('/:userId', async (req, res) => {
  try {
    const items = await WishlistItem.find({ userId: req.params.userId });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
