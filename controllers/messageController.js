const asyncHandler = require('express-async-handler')
const Message = require('../models/messageModel')
const Chat = require('../models/chatModel')
const User = require('../models/userModel')
const generateToken = require('../config/generateToken')
const mongoose = require('mongoose')

const sendMessage = async (req, res) => {
  const { content, chatId } = req.body

  if (!content || !chatId) {
    return res.status(400).send('Invalid data passed into request')
  }

  if (!mongoose.isValidObjectId(chatId)) {
    res.status(400).send('Invalid chat Id')
    return
  }

  var newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  }
  try {
    var message = await Message.create(newMessage)
    message = await message.populate('sender', 'name pic')
    message = await message.populate('chat')
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name pic email',
    })
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message })
    res.status(200).send(message)
  } catch (error) {
    console.log(error)
    res.status(400).send("Message Can't be Send")
  }
}
const allMessage = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name pic email')
      .populate('chat')
      .sort({ updatedAt: -1 })

    res.status(200).json(messages)
  } catch (error) {
    res.status(400).send("Can't get messages")
  }
}

module.exports = {
  allMessage,
  sendMessage,
}
