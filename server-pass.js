// 패스 포트 구현용 입니다! 추후 업데이트 할 예정입니다!

const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const PORT = process.env.PORT;
// 개별 모듈
const passportStrategy = require('./src/routes/passport');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(
  session({
    secret: 'tetz',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
passportStrategy();

const userRouter = require('./src/routes/users');
app.use('/users', userRouter);

app.listen(PORT, () => {
  console.log(`데이터 통신 서버가 ${PORT}에서 작동 중입니다!`);
});
