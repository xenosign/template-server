const express = require('express');
const router = express.Router();
const passport = require('passport');

// mongo controller 모듈 가져오기
const db = require('../controlloers/mongoController');

// 각 주소에 따른 라우팅 처리
// 회원가입, 로그인은 전부 컨트롤러에서 처리되고 있으니
// 컨트롤러에서 값을 받아서 전달하는 역할을 함
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

router.post('/mongo', async (req, res) => {
  const result = await db.postEmendReview(1);
  console.log(result);
  res.send(JSON.stringify(result));
});

module.exports = router;
