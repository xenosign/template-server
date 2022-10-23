// 필요 모듈 설정
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// 회원 가입, 로그인은 userRouter 에서 처리!
const userRouter = require('./src/routes/users');
app.use('/users', userRouter);

app.listen(PORT, () => {
  console.log(`데이터 통신 서버가 ${PORT}에서 작동 중입니다!`);
});
