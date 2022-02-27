const express = require('express')
const dotenv = require('dotenv')
var cors = require('cors')
var connectDB = require('./config/db')
var userRoutes = require('./routes/userRoutes')
var chatRoutes = require('./routes/chatRoutes')
const colors = require('colors')
// const authJwt = require('./config/jwt')
const errorHandler = require('./config/error-handler')

const app = express()
app.use(cors())
dotenv.config()
connectDB()
app.use(express.json())
// app.use(authJwt())
app.use(errorHandler)

app.get('/', (request, response) => {
  response.send('API is Running')
})

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server started on post  ${PORT}`.yellow)
})
