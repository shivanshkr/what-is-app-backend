const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const generateToken = require('../config/generateToken')

const registerUser = asyncHandler(async (req, res) => {
  let { name, email, password, pic } = req.body
  email = email.toLowerCase()
  if (!name || !email || !password) {
    res.status(400).send('Please Enter all the Fields')
    throw new Error('Please Enter all the Fields')
  }
  let user = await User.findOne({ email: email })
  if (user) {
    res.status(400).send('User already exist')
    throw new Error('User already exists')
  }
  const genSalt = bcrypt.genSaltSync(12)
  try {
    user = await User.create({
      name,
      email,
      passwordHash: bcrypt.hashSync(password, genSalt),
      pic,
    })
    if (user) {
      res.status(201).json({
        id: user.id,
        email: user.email,
        name: user.name,
        pic: user.pic,
        token: generateToken(user.id),
      })
    } else {
      res.status(500).send('Failed to create the User')
      throw new Error('Failed to create the User')
    }
  } catch (error) {
    res.status(500).send('Failed to create the User')
    throw new Error('Failed to create the User')
  }
})

const authUser = async (req, res) => {
  let { email, password } = req.body
  email = email.toLowerCase()
  if (!email || !password) {
    res.status(400).send('Please Enter all the Fields')
    throw new Error('Please Enter all the Fields')
  }
  let user = await User.findOne({ email: email })
  if (!user) {
    return res.status(404).send('The User not found')
  }
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    //   if (user && password === user.password) {
    res.status(200).send({
      email: user.email,
      name: user.name,
      id: user.id,
      pic: user.pic,
      token: generateToken(user.id),
    })
  } else {
    return res.status(401).send('Invalid Credential')
  }
}

// /api/user?search=shivansh
const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {}
  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select('-passwordHash')
  res.status(200).send(users)
  console.log(keyword)
}
const getProfile = async (req, res) => {
  const userId = req.user._id

  const user = await User.findById(userId).select('-passwordHash')
  res.status(200).send(user)
}

module.exports = { registerUser, authUser, allUsers, getProfile }
