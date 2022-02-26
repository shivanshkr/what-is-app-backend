const mongoose = require('mongoose')

const messageSchema = mongoose.Schema(
  {
    contents: { type: String, trim: true },

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
exports.Message = mongoose.model('Message', messageSchema)
