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
    origin: process.env.FRONTEND_URL,
  },
})
io.on('connection', (socket) => {
  console.log('connected to socket')

  socket.on('setup', (userData) => {
    socket.join(userData._id)
    console.log('user connected,', userData._id)
    socket.emit('connected')
  })

  socket.on('join chat', (room) => {
    socket.join(room)
    console.log('User Joined room : ' + room)
    socket.emit('connected')
  })
  socket.on('new message', (newMessageReceived) => {
    var chat = newMessageReceived.chat
    if (!chat.users) {
      return console.log('chat.users not defined')
    }
    // socket.in(chat._id).emit('message received', newMessageReceived)
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return
      socket.in(user._id).emit('message received', newMessageReceived)
    })
  })

  socket.on('typing', (room) => {
    socket.in(room).emit('typing')
  })
  socket.on('stop typing', (room) => {
    socket.in(room).emit('stop typing')
  })
})
