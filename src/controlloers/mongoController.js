const mongoClient = require('../dbConnect/mongoConnect');
const _client = mongoClient.connect();

const crypto = require('crypto');

// 비밀 번호 생성용 함수
const createHashedPassword = (password) => {
  const salt = crypto.randomBytes(64).toString('base64');
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 10, 64, 'sha512')
    .toString('base64');
  return { hashedPassword, salt };
  // 해싱할 값, salt, 해시 함수 반복 횟수, 해시 값 길이, 해시 알고리즘
};

const verifyPassword = (password, salt, userPassword) => {
  const hashed = crypto
    .pbkdf2Sync(password, salt, 10, 64, 'sha512')
    .toString('base64');

  if (hashed === userPassword) return true;
  return false;
};

const Users = {
  register: async (registerInfo) => {
    const client = await _client;
    const db = client.db('template').collection('users');
    const duplicated = await db.findOne({ email: registerInfo.email });
    if (duplicated) {
      return {
        duplicated: true,
        msg: '중복 회원 존재',
      };
    } else {
      const hash = createHashedPassword(registerInfo.password);
      const registerUser = {
        email: registerInfo.email,
        nickName: registerInfo.nickName,
        password: hash.hashedPassword,
        salt: hash.salt,
      };

      const result = await db.insertOne(registerUser);
      if (result.acknowledged) {
        return {
          duplicated: false,
          msg: '회원 가입 성공! 로그인 페이지로 이동 합니다.',
        };
      } else {
        throw new Error('통신 이상');
      }
    }
  },
  login: async (loginInfo) => {
    const client = await _client;
    const db = client.db('template').collection('users');
    const findID = await db.findOne({ email: loginInfo.email });
    if (findID) {
      const passwordCheckResult = verifyPassword(
        loginInfo.password,
        findID.salt,
        findID.password
      );

      if (passwordCheckResult) {
        return {
          result: true,
          email: findID.email,
          nickName: findID.nickName,
          msg: '로그인 성공! 메인 페이지로 이동 합니다.',
        };
      } else {
        return {
          result: false,
          msg: '비밀 번호가 틀립니다',
        };
      }
    } else {
      return {
        result: false,
        msg: '해당 ID를 찾을 수 없습니다!',
      };
    }
  },
};

module.exports = Users;
