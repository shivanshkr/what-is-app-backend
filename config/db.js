const mongoose = require('mongoose')

const connectDB = async () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(
        `Database Connection is ready : ${con.connection.host}`.cyan.underline
      )
    })
    .catch((err) => {
      console.log(`${err}`.red.bold)
    })
}
module.exports = connectDB
