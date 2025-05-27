const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  seats: [{
    number: String,
    price: Number
  }],
  totalAmount: Number,
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, default: 'confirmed' }
});

module.exports = mongoose.model('Booking', BookingSchema);