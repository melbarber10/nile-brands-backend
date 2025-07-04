import { Router } from "express";
import {
  changeLoggedUserPassword,
  changeUserPassword,
  createUser,
  deleteUser, getUser,
  getUsers, handleUserImage,
  updateLoggedUser,
  updateUser, uploadUserImage
} from "../controllers/user.js";
import {
  changeLoggedUserPasswordValidator,
  changeUserPasswordValidator,
  createUserValidator,
  deleteUserValidator,
  getUserValidator,
  updateLoggedUserValidator,
  updateUserValidator
} from "../utils/validation/usersValidation.js";
import { allowedTo, checkActive, protectRoutes } from "../controllers/auth.js";
import { setLoggedInUserId } from "../middlewares/setID.js";

const usersRoute = Router();
usersRoute.use(protectRoutes, checkActive);

usersRoute.get("/me", setLoggedInUserId, getUser);
usersRoute.put("/updateMe", uploadUserImage, handleUserImage, updateLoggedUserValidator, updateLoggedUser);
usersRoute.put("/changeMyPassword",changeLoggedUserPasswordValidator, changeLoggedUserPassword);
usersRoute.delete("/deleteMe", allowedTo('user', 'owner'), setLoggedInUserId, deleteUser);

usersRoute.use(allowedTo('admin'));
usersRoute
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, handleUserImage, createUserValidator, createUser);

usersRoute
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, handleUserImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

usersRoute.put(
  "/:id/changePassword",
  changeUserPasswordValidator,
  changeUserPassword
);

export default usersRoute;