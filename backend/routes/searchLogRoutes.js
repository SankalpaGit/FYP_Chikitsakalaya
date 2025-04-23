const express = require('express');
const router = express.Router();
const SearchLog = require('../models/SearchLog');

router.post('/search-logs', async (req, res) => {
  try {
    const { userId, query, filters } = req.body;

    const log = await SearchLog.create({
      userId,
      query,
      filters,
      timestamp: new Date(),
    });

    res.status(201).json({ success: true, data: log });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Could not save search log' });
  }
});

module.exports = router;
