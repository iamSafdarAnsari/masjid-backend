const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/transactions - Protected - add new transaction
router.post('/', auth, async (req, res) => {
  try {
    const { type, amount, category, note, date } = req.body;

    console.log('POST /api/transactions payload:', {
      type,
      amount,
      category,
      hasDate: !!date,
    });

    if (!type || !['credit', 'debit'].includes(type)) {
      return res.status(400).json({ message: 'Invalid or missing type' });
    }
    if (amount == null || isNaN(amount) || Number(amount) < 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    let parsedDate = Date.now();
    if (date) {
      const d = new Date(date);
      if (Number.isNaN(d.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      parsedDate = d;
    }

    const tx = new Transaction({
      type,
      amount: Number(amount),
      category: category || '',
      note: note || '',
      date: parsedDate,
    });

    await tx.save();
    return res.status(201).json(tx);
  } catch (err) {
    console.error('Error creating transaction:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/transactions/:id - Protected - edit transaction
router.put('/:id', auth, async (req, res) => {
  try {
    const { type, amount, category, note, date } = req.body;
    const update = {};

    console.log('PUT /api/transactions/:id payload:', {
      id: req.params.id,
      type,
      amount,
      category,
      hasDate: date !== undefined,
    });

    if (type) {
      if (!['credit', 'debit'].includes(type)) {
        return res.status(400).json({ message: 'Invalid type' });
      }
      update.type = type;
    }

    if (amount != null) {
      if (isNaN(amount) || Number(amount) < 0) {
        return res.status(400).json({ message: 'Invalid amount' });
      }
      update.amount = Number(amount);
    }

    if (category !== undefined) update.category = category;
    if (note !== undefined) update.note = note;
    if (date !== undefined) {
      const d = new Date(date);
      if (Number.isNaN(d.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      update.date = d;
    }

    const tx = await Transaction.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!tx) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    return res.json(tx);
  } catch (err) {
    console.error('Error updating transaction:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/transactions/:id - Protected - delete transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    return res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/transactions/latest - Public - latest 10
router.get('/latest', async (req, res) => {
  try {
    const txs = await Transaction.find().sort({ date: -1 }).limit(10).lean();
    console.log(`GET /api/transactions/latest -> ${txs.length} records`);
    return res.json(txs);
  } catch (err) {
    console.error('Error fetching latest transactions:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/transactions/summary - Public - totals & balance
router.get('/summary', async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $group: {
          _id: null,
          totalCredit: {
            $sum: {
              $cond: [{ $eq: ['$type', 'credit'] }, '$amount', 0],
            },
          },
          totalDebit: {
            $sum: {
              $cond: [{ $eq: ['$type', 'debit'] }, '$amount', 0],
            },
          },
        },
      },
    ]);

    const summary = result[0] || { totalCredit: 0, totalDebit: 0 };
    const balance = summary.totalCredit - summary.totalDebit;

    console.log('GET /api/transactions/summary ->', {
      totalCredit: summary.totalCredit,
      totalDebit: summary.totalDebit,
      balance,
    });

    return res.json({
      totalCredit: summary.totalCredit,
      totalDebit: summary.totalDebit,
      balance,
    });
  } catch (err) {
    console.error('Error fetching summary:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
