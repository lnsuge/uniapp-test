function HttpError (message, config, code, response) {
  this.message = message
  this.config = config
  if (code) {
    this.code = code
  }
  this.response = response
  this.name = 'HttpError'

  // captureStackTrace 方法是 v8 引擎提供，非 v8 运行环境无该方法
  Error.captureStackTrace && Error.captureStackTrace(this, this.constructor)
}

HttpError.prototype = new Error
HttpError.prototype.constructor = HttpError

export default HttpError
