const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user count (must be above /:userId)
router.get('/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (admin)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user (admin)
router.put('/:userId', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user (admin)
router.delete('/:userId', async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.userId);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by ID (must be after /count)
router.get('/:userId', async (req, res) => {
  try {
    // Fetch user by MongoDB _id, exclude password field
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error("Error in GET /api/users/:userId:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
