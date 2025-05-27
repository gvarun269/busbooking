const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. First define the schema
const BusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a bus name']
  },
  route: {
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    stops: [String]
  },
  departureDate: {
    type: Date,
    required: true
  },
  departureTime: String,
  arrivalTime: String,
  seats: [
    {
      number: String,
      isBooked: {
        type: Boolean,
        default: false
      }
    }
  ],
  price: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 2. Then add methods (AFTER schema definition)
BusSchema.methods.toJSON = function() {
  const bus = this.toObject();
  delete bus.seats; // Hide seat details in public responses
  return bus;
};

// 3. Finally create and export the model
module.exports = mongoose.model('Bus', BusSchema);