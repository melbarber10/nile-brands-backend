import Jwt from "jsonwebtoken";

const createToken = (payload) => {
  return Jwt.sign({ _id: payload }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRED_TIME });
};

const createResetToken = (payload) => {
  return Jwt.sign({ _id: payload }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_RESET_EXPIRED_TIME });
};


export { createToken, createResetToken };
