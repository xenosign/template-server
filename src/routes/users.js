const express = require('express');
const router = express.Router();

const db = require('../controlloers/mongoController');

router.get('/register', async (req, res) => {
  const result = await db.register();
  res.send(result);
});

module.exports = router;
