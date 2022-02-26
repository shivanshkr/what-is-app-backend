const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, sparse: true },
    passwordHash: { type: String, required: true },
    pic: {
      type: String,
      required: true,
      default:
        'https://www.pngfind.com/pngs/m/676-6764065_default-profile-picture-transparent-hd-png-download.png',
    },
  },
  { timestamps: true }
)

userSchema.virtual('id').get(function () {
  return this._id.toHexString()
})
module.exports = User = mongoose.model('User', userSchema)
