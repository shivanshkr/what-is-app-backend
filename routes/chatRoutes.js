const express = require('express')
const router = express.Router()
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
  deleteGroup,
} = require('../controllers/chatController')
const protect = require('../config/protect')

router.route('/').post(protect, accessChat)
router.route('/').get(protect, fetchChats)
router.route('/group').post(protect, createGroupChat)
router.route('/group/rename').put(protect, renameGroup)
router.route('/group/remove').put(protect, removeFromGroup)
router.route('/group/add').put(protect, addToGroup)
router.route('/group').delete(protect, deleteGroup)

module.exports = router
