const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

const protect = async (req, res, next) => {
  let token
  const secret = process.env.JWT_SECRET

  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, secret)
      req.user = await userModel.findById(decoded.id).select('-passwordHash')
      next()
    } catch (error) {
      res.status(401).send('Not authorized, no token')
    }
  }
  if (!token) {
    res.status(401).send('Not authorized, no token')
  }
}

module.exports = protect
