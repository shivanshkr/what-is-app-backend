const mongoose = require('mongoose')

const chatSchema = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    groupPic: {
      type: String,
      default:
        'https://res.cloudinary.com/what-is-app/image/upload/v1645968551/group_nfacyi.jpg',
    },
  },
  { timestamps: true }
)

chatSchema.virtual('id').get(function () {
  return this._id.toHexString()
})
module.exports = Chat = mongoose.model('Chat', chatSchema)
