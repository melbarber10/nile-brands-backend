import { StatusCodes } from 'http-status-codes';
import apiErrors from '../utils/apiErrors.js';

// Error Handler Middleware
const errorHandlerMiddleware = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error Stack:', err.stack);
  }

  // Handle known apiErrors
  if (err instanceof apiErrors) {
    return res.status(err.statusCode).json({
      success: false,
      error: { message: err.message },
    });
  }
  
  // Handle CastError (Invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: { message: 'Invalid ObjectId format' },
    });
  }

  // Handle Duplicate Key Error (Code 11000)
  if (err.code && err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue)[0]; // This will get the field that caused the duplication
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: { message: `Duplicate value entered for ${duplicateField} field. Please choose another value.` },
    });
  }

  // Fallback for other errors
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production'
        ? 'Something went wrong, please try again later.'
        : err.message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }), // Include stack in dev
    },
  });
};


export default errorHandlerMiddleware;

