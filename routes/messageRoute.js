import { Router } from "express";
import { protectRoutes } from "../controllers/auth.js";
import { getChattedUsers, getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.js";
import { getMessagesValidator, sendMessageValidator } from "../utils/validation/messageValidation.js";

const messageRoute = Router();

messageRoute.route('/users').get(protectRoutes, getUsersForSidebar);
messageRoute.route('/chattedUsers').get(protectRoutes, getChattedUsers);
messageRoute.route('/:id').get(protectRoutes, getMessagesValidator, getMessages);
messageRoute.route('/send/:id').post(protectRoutes, sendMessageValidator, sendMessage);

export default messageRoute;