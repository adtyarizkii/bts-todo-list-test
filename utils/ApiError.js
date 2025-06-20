/**
 * Represents an error that occurred during an API request.
 * @class
 * @param {number} statusCode - The HTTP status code associated with the error.
 * @param {string} message - A human-readable error message.
 * @param {boolean} [isOperational=true] - Whether the error is an operational error (true) or a programming error (false).
 */
class ApiError extends Error {
    constructor(statusCode, message, isOperational = true) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = isOperational;
    }
  }
  
  module.exports = ApiError;
  