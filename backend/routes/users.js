const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ClaimHistory = require('../models/ClaimHistory');

// Get all users with total points
router.get('/', async (req, res) => {
  const users = await User.find().sort({ totalPoints: -1 });
  res.json(users);
});

// Add a new user
router.post('/add', async (req, res) => {
  const { name } = req.body;
  const user = new User({ name });
  await user.save();
  res.json(user);
});

// Claim random points
router.post('/claim/:id', async (req, res) => {
  const userId = req.params.id;
  const randomPoints = Math.floor(Math.random() * 10) + 1;
  
  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { totalPoints: randomPoints } },
    { new: true }
  );

  const history = new ClaimHistory({
    userId,
    pointsAwarded: randomPoints
  });
  await history.save();

  res.json({ user, randomPoints });
});

// Get claim history
router.get('/history/:id', async (req, res) => {
  const history = await ClaimHistory.find({ userId: req.params.id }).sort({ claimedAt: -1 });
  res.json(history);
});

module.exports = router;
