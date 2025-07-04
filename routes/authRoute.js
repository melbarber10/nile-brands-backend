import { Router } from "express";
import { forgetPassword, googleAuth, login, resetPassword, signup, verifyResetCode } from "../controllers/auth.js";
import { loginValidator, sendMailValidator, signupValidator, updatePasswordValidator } from "../utils/validation/authValidation.js";

const authRoute = Router();

authRoute.route("/signup").post(signupValidator, signup);
authRoute.route("/login").post(loginValidator, login);
authRoute.route("/googleSignin").post(googleAuth);
authRoute.route("/forgetPassword").post(sendMailValidator, forgetPassword);
authRoute.route("/verifyCode").post(verifyResetCode);
authRoute.route("/resetPassword").put(updatePasswordValidator, resetPassword);

export default authRoute;