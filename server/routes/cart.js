const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');

// Add or update item in cart
router.post('/', async (req, res) => {
  try {
    const { userId, productId, name, image, price, quantity } = req.body;

    if (!userId || !productId || !name || !image || price === undefined || quantity === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const item = await CartItem.findOne({ userId, productId });

    if (item) {
      item.quantity += quantity;
      await item.save();
      return res.status(200).json(item);
    } else {
      const newItem = new CartItem({
        userId,
        productId,
        name,
        image,
        price: Number(price),
        quantity,
      });
      await newItem.save();
      return res.status(200).json(newItem);
    }
  } catch (err) {
    console.error('POST /cart error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all cart items for a user
router.get('/:userId', async (req, res) => {
  try {
    const items = await CartItem.find({ userId: req.params.userId });
    res.status(200).json(items);
  } catch (err) {
    console.error('GET /cart/:userId error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update quantity of an item
router.put('/:itemId', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const item = await CartItem.findById(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.quantity = quantity;
    await item.save();

    res.status(200).json(item);
  } catch (err) {
    console.error('PUT /cart/:itemId error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an item from the cart
router.delete('/:itemId', async (req, res) => {
  try {
    const deleted = await CartItem.findByIdAndDelete(req.params.itemId);
    if (!deleted) return res.status(404).json({ message: 'Item not found' });

    res.status(200).json({ message: 'Item removed successfully' });
  } catch (err) {
    console.error('DELETE /cart/:itemId error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Clear all cart items for a user
router.delete('/clear/:userId', async (req, res) => {
  try {
    await CartItem.deleteMany({ userId: req.params.userId });
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (err) {
    console.error('DELETE /cart/clear/:userId error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
