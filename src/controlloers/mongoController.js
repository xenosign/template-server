const mongoClient = require('../dbConnect/mongoConnect');
const _client = mongoClient.connect();

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
      const result = await db.insertOne(registerInfo);
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
      if (loginInfo.password === findID.password) {
        return {
          result: true,
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
