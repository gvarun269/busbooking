// backend/routes/buses.js
const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');

// Predefined cities we operate in
const OPERATING_CITIES = [
  "Bengaluru",
  "Hyderabad",
  "Mumbai",
  "Pune",
  "NITK Surathkal",
  "Khammam"
];

// Case-insensitive city validation
function isValidCity(city) {
  return OPERATING_CITIES.some(
    validCity => validCity.toLowerCase() === city.toLowerCase()
  );
}

// @route   GET /api/buses/search
// @desc    Search buses between predefined cities
router.get('/search', async (req, res) => {
  try {
    const { from, to, date } = req.query;

    // Validate cities
    if (!isValidCity(from) || !isValidCity(to)) {
      return res.status(400).json({
        success: false,
        message: `We only operate between: ${OPERATING_CITIES.join(', ')}`,
        validCities: OPERATING_CITIES
      });
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      });
    }

    const searchDate = new Date(date);
    const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

    const buses = await Bus.find({
      $and: [
        {
          $or: [
            { 'route.from': { $regex: new RegExp(from, 'i') } },
            { 'route.stops': { $regex: new RegExp(from, 'i') } }
          ]
        },
        {
          $or: [
            { 'route.to': { $regex: new RegExp(to, 'i') } },
            { 'route.stops': { $regex: new RegExp(to, 'i') } }
          ]
        },
        {
          departureDate: {
            $gte: startOfDay,
            $lte: endOfDay
          }
        }
      ]
    })
    .select('-seats.isBooked') // Hide booking status from public
    .lean();

    if (buses.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No buses found for this route/date',
        suggestions: {
          alternativeDates: getNextThreeDays(date),
          popularRoutes: getPopularRoutes(from)
        }
      });
    }

    res.json({
      success: true,
      count: buses.length,
      data: buses
    });

  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during search'
    });
  }
});

// Helper functions
function getNextThreeDays(currentDate) {
  const dates = [];
  const date = new Date(currentDate);
  
  for (let i = 1; i <= 3; i++) {
    date.setDate(date.getDate() + 1);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

function getPopularRoutes(fromCity) {
  const popularCombinations = {
    "Bengaluru": ["Hyderabad", "Mumbai", "Pune"],
    "Mumbai": ["Pune", "Hyderabad", "Bengaluru"],
    "Hyderabad": ["Bengaluru", "Mumbai", "Pune"]
  };
  
  return popularCombinations[fromCity] || [];
}

module.exports = router;