const mongoose = require('mongoose');
const Transaction = require('./models/Transaction');
require('dotenv').config();

if (!process.env.MONGO_URI) {
  console.error('Cannot seed database: MONGO_URI is not set in environment variables.');
  process.exit(1);
}

const transactions = [
  { type: 'credit', amount: 5000, category: 'Friday Donation', note: 'Weekly Jummah collection', date: new Date('2024-01-05') },
  { type: 'debit', amount: 1200, category: 'Utility', note: 'Electricity bill for Dec', date: new Date('2024-01-07') },
  { type: 'credit', amount: 15000, category: 'Special Fund', note: 'Donation for carpet renovation', date: new Date('2024-01-10') },
  { type: 'credit', amount: 2500, category: 'General', note: 'Anonymous box donation', date: new Date('2024-01-12') },
  { type: 'debit', amount: 450, category: 'Maintenance', note: 'Water tap repair', date: new Date('2024-01-15') },
  { type: 'credit', amount: 8000, category: 'Friday Donation', note: 'Jummah collection', date: new Date('2024-01-19') },
  { type: 'debit', amount: 3000, category: 'Salary', note: 'Cleaner monthly salary', date: new Date('2024-01-20') },
  { type: 'credit', amount: 1200, category: 'General', note: 'Nikah ceremony donation', date: new Date('2024-01-22') },
  { type: 'debit', amount: 800, category: 'Utility', note: 'Water bill', date: new Date('2024-01-25') },
  { type: 'credit', amount: 6500, category: 'Friday Donation', note: 'End of month Jummah collection', date: new Date('2024-01-26') },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');
    
    await Transaction.deleteMany({}); // Clear existing if any
    await Transaction.insertMany(transactions);
    
    console.log('Successfully seeded 10 transactions.');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
