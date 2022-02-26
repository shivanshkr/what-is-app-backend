const express = require('express')
const router = express.Router()
const {
  registerUser,
  authUser,
  allUsers,
  getProfile,
} = require('../controllers/userControllers')
const protect = require('../config/protect')

router.route('/register').post(registerUser)
router.post('/login', authUser)
router.get('/', protect, allUsers)
router.get('/profile', protect, getProfile)

module.exports = router
