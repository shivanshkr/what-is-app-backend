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
        'https://res.cloudinary.com/what-is-app/image/upload/v1646062233/profilePic_uigcf8.png',
    },
  },
  { timestamps: true }
)

userSchema.virtual('id').get(function () {
  return this._id.toHexString()
})
module.exports = User = mongoose.model('User', userSchema)
