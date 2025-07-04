import { StatusCodes } from 'http-status-codes';

class apiErrors extends Error {
  constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;

    // Capturing stack trace for debugging
    Error.captureStackTrace(this, this.constructor);
  }
}

export default apiErrors;


