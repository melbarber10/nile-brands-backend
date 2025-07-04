import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import usersModel from '../models/usersModel.js';
import messageModel from '../models/messageModel.js';
import { getReceiverSocketId, io } from '../config/socket.js';
import cloudinary from '../config/cloudinary.js';
import apiErrors from '../utils/apiErrors.js';

const getUsersForSidebar = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new apiErrors(
      "Please login first to access application",
      StatusCodes.UNAUTHORIZED
    )
  }
  const filteredUsers = await usersModel.find(
    { _id: { $ne: req.user._id } }
  ).select('-password');

  res.status(StatusCodes.OK).json({ data: filteredUsers });
});
const getChattedUsers = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const messages = await messageModel.find({
    $or: [{ senderId: userId }, { receiverId: userId }]
  }).select('senderId receiverId');

  // Extract unique user IDs form the messages
  const userIdSet = new Set();

  messages.forEach((msg) => {
    const sender = msg.senderId.toString();
    const receiver = msg.receiverId.toString();
    if (sender !== userId.toString()) { userIdSet.add(sender); }
    if (receiver !== userId.toString()) { userIdSet.add(receiver); }
  });

  const uniqueUserIds = [...userIdSet];

  const users = await usersModel.find({
    _id: { $in: uniqueUserIds }
  }).select('-password');

  res.status(StatusCodes.OK).json({ length: users.length, data: users })
})
const getMessages = asyncHandler(async (req, res) => {
  const { id: userId } = req.params;
  const myId = req.user._id;
  const messages = await messageModel.find({
    $or: [
      { senderId: myId, receiverId: userId },
      { senderId: userId, receiverId: myId },
    ],
  });

  res.status(StatusCodes.OK).json({ data: messages });
});
const sendMessage = asyncHandler(async (req, res) => {
  const { text, image } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  let imageUrl;
  if (image) {
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url;
  }

  const newMessage = new messageModel({
    senderId,
    receiverId,
    text,
    image: imageUrl,
  });
  await newMessage.save();

  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', newMessage);
  }

  res.status(StatusCodes.CREATED).json({ data: newMessage });
});

export { getUsersForSidebar, getChattedUsers, getMessages, sendMessage };