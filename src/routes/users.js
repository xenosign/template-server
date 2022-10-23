const express = require('express');
const router = express.Router();
const passport = require('passport');

const db = require('../controlloers/mongoController');

router.post('/register', async (req, res) => {
  const registerInfo = req.body;
  const result = await db.register(registerInfo);
  res.send(JSON.stringify(result));
});

router.post('/login', async (req, res) => {
  const loginInfo = req.body;
  const result = await db.login(loginInfo);
  res.send(JSON.stringify(result));
});

module.exports = router;
