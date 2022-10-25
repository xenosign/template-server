const mongoClient = require('../dbConnect/mongoConnect');
const _client = mongoClient.connect();

// 비밀 번호 암호화를 위한 모듈 추가
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

// 사용자가 로그인 시 입력하는 비밀 번호 값과 DB에 저장 된 비밀 번호 값을 비교하여
// 로그인 성공 여부를 판단해주는 함수
const verifyPassword = (password, salt, userPassword) => {
  const hashed = crypto
    .pbkdf2Sync(password, salt, 10, 64, 'sha512')
    .toString('base64');

  if (hashed === userPassword) return true;
  return false;
};

const Users = {
  // 회원 가입 모듈
  register: async (registerInfo) => {
    const client = await _client;
    const db = client.db('template').collection('users');
    // 동일한 Email 이 DB에 있는지 체크
    const duplicated = await db.findOne({ email: registerInfo.email });
    // 동일한 Email 이 있으면 회원 가입 실패 -> 해당 문구 안내
    if (duplicated) {
      return {
        duplicated: true,
        msg: '중복 회원 존재',
      };
    } else {
      let registerUser = {};
      if (registerInfo.type === 'local') {
        const hash = createHashedPassword(registerInfo.password);
        registerUser = {
          type: registerInfo.type,
          email: registerInfo.email,
          nickName: registerInfo.nickName,
          password: hash.hashedPassword,
          salt: hash.salt,
        };
      } else {
        registerUser = {
          type: registerInfo.type,
          email: registerInfo.email,
          nickName: registerInfo.nickName,
        };
      }

      // 만들어진 회원 가입 정보 DB에 삽입!
      const result = await db.insertOne(registerUser);
      // 정보 처리가 완료되면 회원 가입 성공 여부 전달
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
  // 로그인 모듈
  login: async (loginInfo) => {
    const client = await _client;
    const db = client.db('template').collection('users');
    // 로그인 시 입력한 email 정보가 db 에 있는지 체크
    const findID = await db.findOne({ email: loginInfo.email });
    // db에 email 이 있으면, 비밀 번호 확인 후 로그인 처리
    if (findID) {
      const passwordCheckResult = verifyPassword(
        loginInfo.password,
        findID.salt,
        findID.password
      );

      // 비밀 번호 일치 여부를 토대로 로그인 처리
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
      // db에 email 이 없으면 없다고 안내, 로그인 실패
      return {
        result: false,
        msg: '해당 E-Mail 을 찾을 수 없습니다!',
      };
    }
  },
};

module.exports = Users;
