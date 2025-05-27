require('dotenv').config();
const mongoose = require('mongoose');
const Bus = require('./models/Bus');

// Sample bus data
const sampleBuses = [
  {
    name: "Shivshahi Travels",
    route: {
      from: "Mumbai",
      to: "Pune",
      stops: ["Thane", "Kalamboli"]
    },
    departureDate: new Date('2023-12-15'),
    departureTime: "08:00",
    arrivalTime: "12:00",
    price: 600,
    seats: generateSeats(40, ['A', 'B'])
  },
  {
    name: "Neeta Tours",
    route: {
      from: "Pune",
      to: "Mumbai",
      stops: ["Shivaji Nagar", "Wakad"]
    },
    departureDate: new Date('2023-12-15'),
    departureTime: "14:00",
    arrivalTime: "18:30",
    price: 550,
    seats: generateSeats(36, ['A', 'B', 'C'])
  },
  {
    name: "VRL Travels",
    route: {
      from: "Bangalore",
      to: "Chennai",
      stops: ["Hosur", "Krishnagiri"]
    },
    departureDate: new Date('2023-12-16'),
    departureTime: "22:00",
    arrivalTime: "04:00",
    price: 800,
    seats: generateSeats(30, ['S', 'D'])
  }
];

// Helper function to generate seats
function generateSeats(count, prefixes) {
  const seats = [];
  const seatsPerPrefix = Math.ceil(count / prefixes.length);
  
  prefixes.forEach(prefix => {
    for (let i = 1; i <= seatsPerPrefix; i++) {
      if (seats.length < count) {
        seats.push({
          number: `${prefix}${i}`,
          isBooked: Math.random() > 0.8 // 20% chance of being booked
        });
      }
    }
  });
  
  return seats;
}

// Insert data
async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'test',
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Clear existing data
    await Bus.deleteMany({});
    console.log('Cleared existing bus data');

    // Insert new data
    await Bus.insertMany(sampleBuses);
    console.log('Added sample bus data');

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seedDatabase();