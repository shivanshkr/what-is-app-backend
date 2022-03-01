const express = require('express')
const dotenv = require('dotenv')
var cors = require('cors')
var connectDB = require('./config/db')
var userRoutes = require('./routes/userRoutes')
var chatRoutes = require('./routes/chatRoutes')
var messageRoutes = require('./routes/messageRoutes')
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
app.use('/api/message', messageRoutes)

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  console.log(`Server started on post  ${PORT}`.yellow)
})
const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: 'http://localhost:3000',
  },
})
io.on('connection', (socket) => {
  console.log('connected to socket')
})
