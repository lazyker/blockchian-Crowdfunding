'use strict';

const morgan = require('morgan');
const moment = require('moment');

const MORGAN_OUTPUT = '[:currentMoment] :method :url :status :response-time ms - :res[content-length]';

/**
 * 리퀘스트 객체에 현재시간 추가
 * @param {Object}  req - request object
 * @param {Object}  res - response object
 * @param {Function} next  - next function
 */
const currentMomentPipe = (req, res, next) => {
  // 현재시간 추가 (`yyyy-MM-dd HH:mm`)
  req.currentMoment = moment().format('YYYY-MM-DD HH:mm');
  next();
};

/**
 * API 요청시 출력되는 콘솔 로그에 현재 시간을 추가하기 위한 모건 메세지 수정 코드
 * @param {Object} app  - express app
 */
module.exports = (app) => {
  // Http Request 변수에 현재시간 추가(+09:00)
  app.use(currentMomentPipe);
  // 모건 토큰에 현재시간 추가
  morgan.token('currentMoment', (req) => req.currentMoment);
  // 편집된 모건 사용
  app.use(morgan(MORGAN_OUTPUT));
};
