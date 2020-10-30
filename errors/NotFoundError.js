class NotFoundError extends Error {
  constructor(message, ...rest) {
    super(...rest);
    this.statusCode = 404;
    this.message = message;
  }
}

module.exports = NotFoundError;
