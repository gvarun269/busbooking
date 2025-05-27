const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const Booking = require('../models/Booking');

// @route   GET /api/bookings (Protected)
router.get('/', requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('bus', 'name route departureDate');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;