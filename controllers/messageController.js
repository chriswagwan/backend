const Message = require("../models/Message");
const asyncHandler = require("../utils/asyncHandler");

const createMessage = asyncHandler(async (req, res) => {
  const message = await Message.create(req.body);
  res.status(201).json({
    message: "Your message has been received. Our team will contact you soon.",
    data: message,
  });
});

const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
});

const markMessageAsRead = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }

  message.isRead = true;
  const updatedMessage = await message.save();
  res.json(updatedMessage);
});

module.exports = {
  createMessage,
  getMessages,
  markMessageAsRead,
};
