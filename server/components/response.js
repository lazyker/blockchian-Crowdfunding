/**
 * HTTP 응답은 JSON 타입의 데이터를 전달하는 것을 기본으로 한다.
 *
 * 사용되는 HTTP Status
 *  - 200 OK                      : 일반적인 요청 성공
 *  - 201 Created                 : 성공적인 리소스 생성(보통 POST)
 *  - 202 Accepted                : 비동기 처리가 성공적으로 시작된 경우
 *  - 204 No Content              : 응답 바디에 의도적으로 아무것도 포함되지 않음(보통 PUT, DELETE)
 *  - 301 Moved Permanently       : 리소스 모델이 재설계되어 요청 경로가 변경됨
 *  - 304 Not Modified            : 클라이언트의 정보가 최신인 경우
 *  - 400 Bad Request             : 일반적인 요청 실패
 *  - 401 Unauthorized            : 인증되지 않음
 *  - 403 Forbidden               : 인증과 상관없이 액세스 금지
 *  - 404 Not Found               : 요청 URI에 해당하는 리소스가 없음
 *  - 409 Conflict                : 리소스 상태에 위반됨(e.g. 비어있지 않은 리소스에 대한 삭제 요청)
 *  - 422 Unprocessable Entity    : 전달된 데이터의 형태가 유효하지 않음 (deprecated) -> 400 Bad Request
 *  - 500 Internal Server Error   : 내부 서버 에러(API가 잘못 작동할 때)
 *  - 503 Service Unavailable     : 외부 서비스가 멈춘상태
 *
 * 에러 발생시 응답 본문
 * {
 *   "error": {
 *     "status": {number} HTTP 스테이터스,
 *     "name": {string} 에러명,
 *     "message": {string} 에러 메세지,
 *     "alertMessage": {string=} 출력할 에러 메세지
 *   }
 * }
 */

'use strict';

const _ = require('lodash');
// const Logger = require('../config/logger');
// const logger = Logger.getLogger(Logger.TYPE.COMMON, 'response');

const errMessage = {
  DEFAULT_ERROR: '알 수 없는 에러가 발생했습니다. 서버 관리자에게 문의하세요.',
};

/**
 * JSON 성공 응답
 *
 * @param {Object}res       - 익스프레스 응답 객체
 * @param {Number=} status  - 응답할 HTTP 상태코드
 * @returns {function}
 */
function respondSuccess(res, status) {
  /**
   * 성공처리 함수
   * @param {*} entity - 결과값
   * @returns {*} entity - 결과값
   */
  return (entity) => {
    if (entity) {
      res.status(status).json(entity);
    }
    return entity;
  };
}

/**
 * JSON 에러 응답
 * @param {Object}  res               - 익스프레스 응답 객체
 * @param {Error}   err               - 에러 객체
 * @param {String}  err.name          - 에러명
 * @param {Number}  err.status        - 응답할 HTTP 상태코드
 * @param {String}  err.message       - 에러 메세지
 * @param {String}  err.alertMessage  - 출력할 에러 메세지
 * @returns {*}
 */
function respondError(res, err) {
  let { message } = err;

  // 코드에 고려되지 않은 에러를 처리하기 위한 안내 문구 추가
  if (err.status === 500) {
    message = `${errMessage.DEFAULT_ERROR}(${err.message})`;
  }

  const error = {
    status: err.status,
    name: err.name,
    message,
  };

  if (_.isNil(err.alertMessage) === false) {
    error.alertMessage = err.alertMessage;
  }
  return res.status(err.status).json({ error });
}

/**
 * 몽구스 밸리데이션 에러 메세지 응답
 *
 * @param {Object}  res               - 익스프레스 응답 객체
 * @param {Error}   err               - 에러 객체
 * @param {String}  err.name          - 에러명
 * @param {Number=} err.status        - 응답할 HTTP 상태코드
 * @param {String=} err.message       - 에러 메세지
 * @param {String}  err.alertMessage  - 출력할 에러 메세지
 * @returns {*}
 */
function respondMongooseValidationError(res, err) {
  if (_.isNil(err.status)) {
    err.status = 400;
  }
  err.message = `${errMessage.DEFAULT_ERROR} (${err.errors[Object.keys(err.errors)[0]].message})`;
  return respondError(res, err);
}

/**
 * 몽구스 캐스팅 에러 메세지 응답
 *
 * @param {Object}  res               - 익스프레스 응답 객체
 * @param {Error}   err               - 에러 객체
 * @param {String}  err.name          - 에러명
 * @param {Number=} err.status        - 응답할 HTTP 상태코드
 * @param {String=} err.message       - 에러 메세지
 * @param {String}  err.alertMessage  - 출력할 에러 메세지
 * @returns {*}
 */
function respondMongooseCastError(res, err) {
  if (_.isNil(err.status)) {
    err.status = 400;
  }
  err.message = `${errMessage.DEFAULT_ERROR} (\`${err.path}\` 필드는 ${err.kind} 타입이므로, \`${err.value}\`가 담길 수 없습니다.)`;
  return respondError(res, err);
}

/**
 * JSON 웹 토큰의 인증 에러 메세지 응답
 *
 * @param {Object}  res               - 익스프레스 응답 객체
 * @param {Error}   err               - 에러 객체
 * @param {String}  err.name          - 에러명
 * @param {Number=} err.status        - 응답할 HTTP 상태코드
 * @param {String=} err.message       - 에러 메세지
 * @param {String}  err.alertMessage  - 출력할 에러 메세지
 * @returns {*}
 */
function respondUnauthorizedError(res, err) {
  if (_.isNil(err.status)) {
    err.status = 401;
  }
  switch (err.code) {
    case 'credentials_required':
      err.message = 'Authorization 헤더가 누락됐습니다.';
      break;
    case 'credentials_bad_format':
      err.message = 'Authorization 헤더는 `Bearer [인증 토큰]`을 갖는 형태입니다.';
      break;
    case 'invalid_token':
      if (err.message === 'jwt expired') {
        err.message = '인증 토큰이 만료되었습니다.';
      } else {
        err.message = '유효하지 않은 인증 토큰이 전달되었습니다.';
      }
      break;
    default:
      break;
  }
  return respondError(res, err);
}

/**
 * 기본 에러 메세지 응답
 *
 * @param {Object}  res               - 익스프레스 응답 객체
 * @param {Error}   err               - 에러 객체
 * @param {String}  err.name          - 에러명
 * @param {Number=} err.status        - 응답할 HTTP 상태코드
 * @param {String=} err.message       - 에러 메세지
 * @param {String}  err.alertMessage  - 출력할 에러 메세지
 * @param {Number=} statusCode        - 응답할 HTTP 상태코드
 * @returns {*}
 */
function respondDefaultError(res, err, statusCode) {
  if (statusCode) {
    err.status = statusCode;
  } else if (_.isNil(err.status)) {
    err.status = 500;
  }
  if (_.isNil(err.message)) {
    err.message = errMessage.DEFAULT_ERROR;
  }
  return respondError(res, err);
}

module.exports = {
  /**
   * 200 OK 응답 함수
   *
   * @param {Object} req - 익스프레스 요청 객체
   * @param {Object} res - 익스프레스 응답 객체
   */
  sendOK(req, res) {
    res.status(200).end('OK');
  },

  /**
   * 404 Not Found 응답 함수
   *
   * @param {Object} req - 익스프레스 요청 객체
   * @param {Object} res - 익스프레스 응답 객체
   */
  sendNotFound(req, res) {
    res.status(404).end('Not Found');
  },

  /**
   * 요청한 데이터를 JSON 데이터로 전달
   *
   * @param {Object} res          - 익스프레스 응답 객체
   * @param {Number=} statusCode  - 응답할 HTTP 상태코드
   * @returns {function}
   * @deprecated
   */
  respondWithResult(res, statusCode) {
    return respondSuccess(res, statusCode || 200);
  },

  /**
   * 200 OK 응답
   *
   * @param {Object} res - 익스프레스 응답 객체
   * @returns {Function}
   */
  respondWithOK(res) {
    return respondSuccess(res, 200);
  },

  /**
   * 201 Created 응답
   *
   * @param {Object} res - 익스프레스 응답 객체
   * @returns {Function}
   */
  respondWithCreated(res) {
    return respondSuccess(res, 201);
  },

  /**
   * 203 Accepted 응답
   *
   * @param {Object} res - 익스프레스 응답 객체
   * @returns {Function}
   */
  respondWithAccepted(res) {
    return respondSuccess(res, 203);
  },

  /**
   * 성공하였으나 전달할 데이터 없음
   *
   * @param {Object} res - 익스프레스 응답 객체
   * @returns {function}
   */
  respondWithNoContent(res) {
    /**
     * 204 처리 함수
     *
     * @param {*=} entity - 결과값
     * @returns {*} entity - 결과값
     */
    return (entity) => {
      res.status(204).end();
      return entity;
    };
  },

  /**
   * 실패 메세지를 JSON 향테로 응답
   *
   * @param {Object}  res         - 익스프레스 응답 객체
   * @param {Number=} statusCode  - 응답할 HTTP 상태코드
   * @returns {function}
   */
  handleError(res, statusCode) {
    /**
     * 에러처리 함수
     *
     * @param {Error} err - 에러 객체
     * @returns {function}
     */
    return (err) => {
      console.log(`${err.name} - ${err.message}`, err.data);
      switch (err.name) {
        case 'ValidationError':
          return respondMongooseValidationError(res, err);
        case 'CastError':
          return respondMongooseCastError(res, err);
        case 'UnauthorizedError':
          return respondUnauthorizedError(res, err);
        default:
          return respondDefaultError(res, err, statusCode);
      }
    };
  },
};
