/**
 * 상황별 에러 객체
 */

'use strict';

const _ = require('lodash');

/**
 * 데이터 형태 에러 메세지 조합
 * - 몽구스의 ValidationError 포매팅 참조
 *
 * @param {String}  message   - 에러 메세지
 * @param {String=} fieldName - 에러가 발생한 필드명
 * @returns {String}          - 필드명을 가공한 메세지
 */
function formatMessage(message, fieldName) {
  if (!fieldName) {
    return message;
  }
  return message.replace(/{PATH}/g, fieldName);
}

/**
 * 데이터 형태 에러 메세지 조합
 * - 몽구스의 ValidationError 포매팅 참조
 *
 * @param {String|Object}  message   - 에러 메세지
 * @param {String} message.message - 에러 메시지
 * @param {String} message.fieldName - 필드 명
 * @param {String=} fieldName - 에러가 발생한 필드명
 * @returns {String}          - 필드명을 가공한 메세지
 */
function getMessage(message, fieldName) {
  let msg;
  if (_.isObject(message)) {
    msg = message.message;
    fieldName = message.fieldName; // eslint-disable-line
  } else {
    msg = message;
  }
  return formatMessage(msg, fieldName);
}

/**
 * 일반적인 요청 실패 에러
 */
class BadRequestError extends Error {
  /**
   * @param {Object|String} message         - 에러 메세지
   * @param {String=}       message.message - 에러 상태 메세지
   * @param {String=}       message.alert   - 출력할 에러 메세지
   * @param {String=}       fieldName       - 에러가 발생한 필드명
   * @param {String=}       fileName        - Error()를 호출한 코드를 포함하고 있는 필드명
   * @param {Number=}       fileNumber      - Error()를 호출을 포함하고 있는 줄번호
   */
  constructor(message, fieldName, fileName, fileNumber) {
    super(getMessage(message, fieldName), fileName, fileNumber);

    if (message.alert) {
      this.alertMessage = formatMessage(message.alert, fieldName);
    }
    if (message.data) {
      this.data = message.data;
    }

    this.name = this.constructor.name;
    this.status = 400;
  }
}

/**
 * 필수값 에러
 * - 필수값이 누락된 경우
 */
class RequiredError extends Error {
  /**
   * @param {Object|String} message         - 에러 메세지
   * @param {String=}       message.message - 에러 상태 메세지
   * @param {String=}       message.alert   - 출력할 에러 메세지
   * @param {String=}       fieldName       - 에러가 발생한 필드명
   * @param {String=}       fileName        - Error()를 호출한 코드를 포함하고 있는 필드명
   * @param {Number=}       fileNumber      - Error()를 호출을 포함하고 있는 줄번호
   */
  constructor(message, fieldName, fileName, fileNumber) {
    super(getMessage(message, fieldName), fileName, fileNumber);

    if (message.alert) {
      this.alertMessage = formatMessage(message.alert, fieldName);
    }
    if (message.data) {
      this.data = message.data;
    }

    this.name = this.constructor.name;
    this.status = 400;
  }
}

/**
 * 데이터 타입 에러
 * - 정해진 타입이 아닌 경우
 */
class DataTypeError extends Error {
  /**
   * @param {Object|String} message         - 에러 메세지
   * @param {String=}       message.message - 에러 상태 메세지
   * @param {String=}       message.alert   - 출력할 에러 메세지
   * @param {String=}       fieldName       - 에러가 발생한 필드명
   * @param {String=}       fileName        - Error()를 호출한 코드를 포함하고 있는 필드명
   * @param {Number=}       fileNumber      - Error()를 호출을 포함하고 있는 줄번호
   */
  constructor(message, fieldName, fileName, fileNumber) {
    super(getMessage(message, fieldName), fileName, fileNumber);

    if (message.alert) {
      this.alertMessage = formatMessage(message.alert, fieldName);
    }
    if (message.data) {
      this.data = message.data;
    }

    this.name = this.constructor.name;
    this.status = 400;
  }
}

/**
 * 이뉴머레이션 밸류 에러
 * - 전달된 값이 주어진 enum 값이 아닐 경우
 */
class EnumerationError extends Error {
  /**
   * @param {Object|String} message         - 에러 메세지
   * @param {String=}       message.message - 에러 상태 메세지
   * @param {String=}       message.alert   - 출력할 에러 메세지
   * @param {String=}       fieldName       - 에러가 발생한 필드명
   * @param {String=}       fileName        - Error()를 호출한 코드를 포함하고 있는 필드명
   * @param {Number=}       fileNumber      - Error()를 호출을 포함하고 있는 줄번호
   */
  constructor(message, fieldName, fileName, fileNumber) {
    super(getMessage(message, fieldName), fileName, fileNumber);

    if (message.alert) {
      this.alertMessage = formatMessage(message.alert, fieldName);
    }
    if (message.data) {
      this.data = message.data;
    }

    this.name = this.constructor.name;
    this.status = 400;
  }
}

/**
 * 유니크 에러
 * - 유니크 조건을 만족시키지 못하는 경우
 */
class UniqueError extends Error {
  /**
   * @param {Object|String} message         - 에러 메세지
   * @param {String=}       message.message - 에러 상태 메세지
   * @param {String=}       message.alert   - 출력할 에러 메세지
   * @param {String=}       fieldName       - 에러가 발생한 필드명
   * @param {String=}       fileName        - Error()를 호출한 코드를 포함하고 있는 필드명
   * @param {Number=}       fileNumber      - Error()를 호출을 포함하고 있는 줄번호
   */
  constructor(message, fieldName, fileName, fileNumber) {
    super(getMessage(message, fieldName), fileName, fileNumber);

    if (message.alert) {
      this.alertMessage = formatMessage(message.alert, fieldName);
    }
    if (message.data) {
      this.data = message.data;
    }

    this.name = this.constructor.name;
    this.status = 400;
  }
}

/**
 * 인증 에러
 */
class UnauthorizedError extends Error {
  /**
   * @param {Object|String} message         - 에러 메세지
   * @param {String=}       message.message - 에러 상태 메세지
   * @param {String=}       message.alert   - 출력할 에러 메세지
   * @param {String=}       fieldName       - 에러가 발생한 필드명
   * @param {String=}       fileName        - Error()를 호출한 코드를 포함하고 있는 필드명
   * @param {Number=}       fileNumber      - Error()를 호출을 포함하고 있는 줄번호
   */
  constructor(message, fieldName, fileName, fileNumber) {
    super(getMessage(message, fieldName), fileName, fileNumber);

    if (message.alert) {
      this.alertMessage = formatMessage(message.alert, fieldName);
    }
    if (message.data) {
      this.data = message.data;
    }

    this.name = this.constructor.name;
    this.status = 401;
  }
}

/**
 * 인증과 상관없는 액세스 금지 에러
 */
class ForbiddenError extends Error {
  /**
   * @param {Object|String} message         - 에러 메세지
   * @param {String=}       message.message - 에러 상태 메세지
   * @param {String=}       message.alert   - 출력할 에러 메세지
   * @param {String=}       fieldName       - 에러가 발생한 필드명
   * @param {String=}       fileName        - Error()를 호출한 코드를 포함하고 있는 필드명
   * @param {Number=}       fileNumber      - Error()를 호출을 포함하고 있는 줄번호
   */
  constructor(message, fieldName, fileName, fileNumber) {
    super(getMessage(message, fieldName), fileName, fileNumber);

    if (message.alert) {
      this.alertMessage = formatMessage(message.alert, fieldName);
    }
    if (message.data) {
      this.data = message.data;
    }

    this.name = this.constructor.name;
    this.status = 403;
  }
}

/**
 * 데이터를 찾을 수 없을 경우의 에러
 */
class NotFoundError extends Error {
  /**
   * @param {Object|String} message         - 에러 메세지
   * @param {String=}       message.message - 에러 상태 메세지
   * @param {String=}       message.alert   - 출력할 에러 메세지
   * @param {String=}       fieldName       - 에러가 발생한 필드명
   * @param {String=}       fileName        - Error()를 호출한 코드를 포함하고 있는 필드명
   * @param {Number=}       fileNumber      - Error()를 호출을 포함하고 있는 줄번호
   */
  constructor(message, fieldName, fileName, fileNumber) {
    super(getMessage(message, fieldName), fileName, fileNumber);

    if (message.alert) {
      this.alertMessage = formatMessage(message.alert, fieldName);
    }
    if (message.data) {
      this.data = message.data;
    }

    this.name = this.constructor.name;
    this.status = 404;
  }
}

/**
 * 리소스 상태에 위반됨 에러
 */
class ConflictError extends Error {
  /**
   * @param {Object|String} message         - 에러 메세지
   * @param {String=}       message.message - 에러 상태 메세지
   * @param {String=}       message.alert   - 출력할 에러 메세지
   * @param {String=}       fieldName       - 에러가 발생한 필드명
   * @param {String=}       fileName        - Error()를 호출한 코드를 포함하고 있는 필드명
   * @param {Number=}       fileNumber      - Error()를 호출을 포함하고 있는 줄번호
   */
  constructor(message, fieldName, fileName, fileNumber) {
    super(getMessage(message, fieldName), fileName, fileNumber);

    if (message.alert) {
      this.alertMessage = formatMessage(message.alert, fieldName);
    }
    if (message.data) {
      this.data = message.data;
    }

    this.name = this.constructor.name;
    this.status = 409;
  }
}

/**
 * 전달된 데이터 형태의 에러
 * @deprecated
 */
class EntityError extends Error {
  /**
   * @param {Object|String} message         - 에러 메세지
   * @param {String=}       message.message - 에러 상태 메세지
   * @param {String=}       message.alert   - 출력할 에러 메세지
   * @param {String=}       fieldName       - 에러가 발생한 필드명
   * @param {String=}       fileName        - Error()를 호출한 코드를 포함하고 있는 필드명
   * @param {Number=}       fileNumber      - Error()를 호출을 포함하고 있는 줄번호
   */
  constructor(message, fieldName, fileName, fileNumber) {
    super(getMessage(message, fieldName), fileName, fileNumber);

    if (message.alert) {
      this.alertMessage = formatMessage(message.alert, fieldName);
    }
    if (message.data) {
      this.data = message.data;
    }

    this.name = this.constructor.name;
    this.status = 422;
  }
}

/**
 * 내부 서버 에러
 */
class InternalServerError extends Error {
  /**
   * @param {Object|String} message         - 에러 메세지
   * @param {String=}       message.message - 에러 상태 메세지
   * @param {String=}       message.alert   - 출력할 에러 메세지
   * @param {String=}       fieldName       - 에러가 발생한 필드명
   * @param {String=}       fileName        - Error()를 호출한 코드를 포함하고 있는 필드명
   * @param {Number=}       fileNumber      - Error()를 호출을 포함하고 있는 줄번호
   */
  constructor(message, fieldName, fileName, fileNumber) {
    super(getMessage(message, fieldName), fileName, fileNumber);

    if (message.alert) {
      this.alertMessage = formatMessage(message.alert, fieldName);
    }
    if (message.data) {
      this.data = message.data;
    }

    this.name = this.constructor.name;
    this.status = 500;
  }
}

/**
 * 외부 서비스를 사용할 수 없는 에러
 */
class ServiceUnavailableError extends Error {
  /**
   * @param {Object|String} message         - 에러 메세지
   * @param {String=}       message.message - 에러 상태 메세지
   * @param {String=}       message.alert   - 출력할 에러 메세지
   * @param {String=}       fieldName       - 에러가 발생한 필드명
   * @param {String=}       fileName        - Error()를 호출한 코드를 포함하고 있는 필드명
   * @param {Number=}       fileNumber      - Error()를 호출을 포함하고 있는 줄번호
   */
  constructor(message, fieldName, fileName, fileNumber) {
    super(getMessage(message, fieldName), fileName, fileNumber);

    if (message.alert) {
      this.alertMessage = formatMessage(message.alert, fieldName);
    }
    if (message.data) {
      this.data = message.data;
    }

    this.name = this.constructor.name;
    this.status = 503;
  }
}

/**
 * 프록시 서버 사용시 에러
 */
class ProxyError extends Error {
  /**
   * @param {Object}        error           - 에러 메세지
   * @param {String=}       fileName        - Error()를 호출한 코드를 포함하고 있는 필드명
   * @param {Number=}       fileNumber      - Error()를 호출을 포함하고 있는 줄번호
   */
  constructor(error, fileName, fileNumber) {
    super(error.message, fileName, fileNumber);

    this.name = error.name;
    this.status = error.status;
    this.message = error.message;
    if (error.alertMessage) {
      this.alertMessage = error.alertMessage;
    }
  }
}

module.exports = {
  BadRequestError,
  RequiredError,
  DataTypeError,
  EnumerationError,
  UniqueError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  EntityError,
  InternalServerError,
  ServiceUnavailableError,
  ProxyError,
};
