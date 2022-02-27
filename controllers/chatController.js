const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const Chat = require('../models/chatModel')
const generateToken = require('../config/generateToken')
const mongoose = require('mongoose')

const accessChat = async (req, res) => {
  const { userId } = req.body
  if (!userId) {
    return res.status(400).send('No User Id')
  }
  if (!mongoose.isValidObjectId(userId)) {
    res.status(400).send('Invalid User Id')
    return
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-passwordHash')
    .populate('latestMessage')

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name pic email',
  })
  if (isChat?.length > 0) {
    res.status(200).send(isChat[0])
  } else {
    var chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    }
    try {
      console.log('before create')
      console.log('Data : ', chatData)

      const createdChat = await Chat.create(chatData)
      console.log('after create')

      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        'users',
        '-passwordHash'
      )
      res.status(200).send(FullChat)
    } catch (error) {
      res.status(400).send(error)
      console.log(error)
    }
  }
}
const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate('users', '-passwordHash')
      .populate('groupAdmin', '-passwordHash')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = await User.populate(result, {
          path: 'latestMessage.sender',
          select: 'name pic email',
        })
        res.status(200).send(result)
      })
  } catch (error) {
    res.status(400).send(error)
  }
}
const createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send('Please Fill all the fields')
  }

  var users = JSON.parse(req.body.users)

  if (users.length < 2) {
    return res
      .status(400)
      .send('More than 2 users are required to form a group chat')
  }

  users.push(req.user)

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
      groupPic: req.body.groupPic,
    })

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-passwordHash')
      .populate('groupAdmin', '-passwordHash')

    res.status(200).json(fullGroupChat)
  } catch (error) {
    console.log(error)
    res.status(400)
  }
}
const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body
  if (!mongoose.isValidObjectId(chatId)) {
    res.status(400).send('Invalid chat Id')
    return
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate('users', '-passwordHash')
    .populate('groupAdmin', '-passwordHash')

  if (!updatedChat) {
    res.status(404).send('Chat Not Found')
  } else {
    res.status(200).json(updatedChat)
  }
}
const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body
  if (!mongoose.isValidObjectId(chatId)) {
    res.status(400).send('Invalid chat Id')
    return
  }
  if (!mongoose.isValidObjectId(userId)) {
    res.status(400).send('Invalid user Id')
    return
  }

  // check if the requester is admin
  const chat = await Chat.findById(chatId)
  if (chat) {
    if (chat.groupAdmin == req.user.id) {
      const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
          $pull: { users: userId },
        },
        {
          new: true,
        }
      )
        .populate('users', '-passwordHash')
        .populate('groupAdmin', '-passwordHash')

      if (!removed) {
        res.status(404).send('Chat Not Found')
      } else {
        res.json(removed)
      }
    } else {
      res.status(404).send('You are not admin')
    }
  } else {
    res.status(404).send('Chat Not Found')
  }
}
const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body
  if (!mongoose.isValidObjectId(chatId)) {
    res.status(400).send('Invalid chat Id')
    return
  }
  if (!mongoose.isValidObjectId(userId)) {
    res.status(400).send('Invalid user Id')
    return
  }

  // check if the requester is admin
  const chat = await Chat.findById(chatId)
  if (chat) {
    if (chat.groupAdmin == req.user.id) {
      const added = await Chat.findByIdAndUpdate(
        chatId,
        {
          $push: { users: userId },
        },
        {
          new: true,
        }
      )
        .populate('users', '-passwordHash')
        .populate('groupAdmin', '-passwordHash')

      if (!added) {
        res.status(404).send('Chat Not Found')
      } else {
        res.json(added)
      }
    } else {
      res.status(404).send('You are not admin')
    }
  } else {
    res.status(404).send('Chat Not Found')
  }
}
const deleteGroup = async (req, res) => {
  const { chatId } = req.body
  if (!mongoose.isValidObjectId(chatId)) {
    res.status(400).send('Invalid chat Id')
    return
  }

  // check if the requester is admin
  const chat = await Chat.findById(chatId)
  if (chat) {
    if (chat.groupAdmin == req.user.id) {
      const deleted = await Chat.deleteOne({ _id: chatId })

      if (!deleted) {
        res.status(404).send('Chat Not Found')
      } else {
        res.json(deleted)
      }
    } else {
      res.status(404).send('You are not admin')
    }
  } else {
    res.status(404).send('Chat Not Found')
  }
}

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
  deleteGroup,
}
