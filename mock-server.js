const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let dummyTransactions = [
  { _id: '1', type: 'credit', amount: 5000, category: 'Friday Donation', note: 'Weekly Jummah collection', date: '2024-01-05T00:00:00.000Z' },
  { _id: '2', type: 'debit', amount: 1200, category: 'Utility', note: 'Electricity bill for Dec', date: '2024-01-07T00:00:00.000Z' },
  { _id: '3', type: 'credit', amount: 15000, category: 'Special Fund', note: 'Donation for carpet renovation', date: '2024-01-10T00:00:00.000Z' },
  { _id: '4', type: 'credit', amount: 2500, category: 'General', note: 'Anonymous box donation', date: '2024-01-12T00:00:00.000Z' },
  { _id: '5', type: 'debit', amount: 450, category: 'Maintenance', note: 'Water tap repair', date: '2024-01-15T00:00:00.000Z' },
  { _id: '6', type: 'credit', amount: 8000, category: 'Friday Donation', note: 'Jummah collection', date: '2024-01-19T00:00:00.000Z' },
  { _id: '7', type: 'debit', amount: 3000, category: 'Salary', note: 'Cleaner monthly salary', date: '2024-01-20T00:00:00.000Z' },
  { _id: '8', type: 'credit', amount: 1200, category: 'General', note: 'Nikah ceremony donation', date: '2024-01-22T00:00:00.000Z' },
  { _id: '9', type: 'debit', amount: 800, category: 'Utility', note: 'Water bill', date: '2024-01-25T00:00:00.000Z' },
  { _id: '10', type: 'credit', amount: 6500, category: 'Friday Donation', note: 'End of month Jummah collection', date: '2024-01-26T00:00:00.000Z' },
];

const calculateSummary = () => {
  const totalCredit = dummyTransactions.filter(t => t.type === 'credit').reduce((a, b) => a + b.amount, 0);
  const totalDebit = dummyTransactions.filter(t => t.type === 'debit').reduce((a, b) => a + b.amount, 0);
  return { totalCredit, totalDebit, balance: totalCredit - totalDebit };
};

app.get('/api/transactions/summary', (req, res) => res.json(calculateSummary()));
app.get('/api/transactions/latest', (req, res) => res.json(dummyTransactions));

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '123456') {
    res.json({ token: 'mock-jwt-token' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.post('/api/transactions', (req, res) => {
  const newTx = { ...req.body, _id: Date.now().toString() };
  dummyTransactions.unshift(newTx);
  res.json(newTx);
});

app.delete('/api/transactions/:id', (req, res) => {
  const index = dummyTransactions.findIndex(t => t._id === req.params.id);
  if (index !== -1) {
    dummyTransactions.splice(index, 1);
    res.json({ message: 'Deleted successfully' });
  } else {
    res.status(404).json({ message: 'Transaction not found' });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Mock API running' }));

// Use a different port than the real backend to avoid conflicts
const PORT = process.env.MOCK_PORT || 5001;
app.listen(PORT, () => console.log(`Mock Server running on port ${PORT}`));
