const express = require('express')
const router = express.Router()
const { sendMessage, allMessage } = require('../controllers/messageController')
const protect = require('../config/protect')

router.route('/').post(protect, sendMessage)
router.route('/:chatId').get(protect, allMessage)

module.exports = router
