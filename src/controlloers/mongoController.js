const mongoClient = require('../dbConnect/mongoConnect');
const _client = mongoClient.connect();

const Users = {
  register: async (user) => {
    const client = await _client;
    const db = client.db('template').collection('users');
    const duplicated = await db.findOne({ id: user.id });
    if (duplicated) {
      return {
        duplicated: true,
        msg: '중복 회원 존재',
      }
    } else {
      const result = await db.insertOne(user);
      if (result.acknowledged) {
        return {
          duplicated: false,
          msg: '회원 가입 성공',
        };
      } else {
        throw new Error('통신 이상');
      }
    }
  },
};

module.exports = Users;
