const express = require('express');
const router = express.Router();
const seedDatabase = require('../seed');

router.post('/reset', async (req, res) => {
  if (req.headers['x-reset-secret'] !== process.env.RESET_SECRET) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    await seedDatabase();
    res.json({ message: 'Database reset complete' });
  } catch (err) {
    res.status(500).json({ message: 'Reset failed', error: err.message });
  }
});

module.exports = router;
