import { StatusCodes } from "http-status-codes";

const notFoundMiddleware = (req, res) => {
  console.error(`[404] ${req.method} ${req.originalUrl} - Route not found`);

  const response = {
    success: false,
    message: 'Route not found',
    method: req.method,
    path: req.originalUrl,
  };
  return res.status(StatusCodes.NOT_FOUND).json(response);
};

export default notFoundMiddleware;

