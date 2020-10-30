class UnauthorizedError extends Error {
  constructor(message, ...rest) {
    super(...rest);
    this.statusCode = 401;
    this.message = message;
  }
}

module.exports = UnauthorizedError;
