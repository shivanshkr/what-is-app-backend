const mongoose = require('mongoose')

const messageSchema = mongoose.Schema(
  {
    content: { type: String, trim: true },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    },
  },
  { timestamps: true }
)

messageSchema.virtual('id').get(function () {
  return this._id.toHexString()
})
module.exports = Message = mongoose.model('Message', messageSchema)
