import { validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    return;
  }
  return next();
};

export default validatorMiddleware;