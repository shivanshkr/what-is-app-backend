const express = require('express')
const dotenv = require('dotenv')
var cors = require('cors')
var connectDB = require('./config/db')
var userRoutes = require('./routes/userRoutes')
var chatRoutes = require('./routes/chatRoutes')
const colors = require('colors')
// const authJwt = require('./config/jwt')

const app = express()
app.use(cors())
dotenv.config()
connectDB()
app.use(express.json())
// app.use(authJwt())

app.get('/', (request, response) => {
  response.send('API is Running')
})

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)

const PORT = process.env.PORT || 6000

app.listen(PORT, () => {
  console.log(`Server started on post  ${PORT}`.yellow)
})
const chats = [
  {
    isGroupChat: false,
    users: [
      {
        name: 'John Doe',
        email: 'john@example.com',
      },
      {
        name: 'Piyush',
        email: 'piyush@example.com',
      },
    ],
    _id: '617a077e18c25468bc7c4dd4',
    chatName: 'John Doe',
  },
  {
    isGroupChat: false,
    users: [
      {
        name: 'Guest User',
        email: 'guest@example.com',
      },
      {
        name: 'Piyush',
        email: 'piyush@example.com',
      },
    ],
    _id: '617a077e18c25468b27c4dd4',
    chatName: 'Guest User',
  },
  {
    isGroupChat: false,
    users: [
      {
        name: 'Anthony',
        email: 'anthony@example.com',
      },
      {
        name: 'Piyush',
        email: 'piyush@example.com',
      },
    ],
    _id: '617a077e18c2d468bc7c4dd4',
    chatName: 'Anthony',
  },
  {
    isGroupChat: true,
    users: [
      {
        name: 'John Doe',
        email: 'jon@example.com',
      },
      {
        name: 'Piyush',
        email: 'piyush@example.com',
      },
      {
        name: 'Guest User',
        email: 'guest@example.com',
      },
    ],
    _id: '617a518c4081150716472c78',
    chatName: 'Friends',
    groupAdmin: {
      name: 'Guest User',
      email: 'guest@example.com',
    },
  },
  {
    isGroupChat: false,
    users: [
      {
        name: 'Jane Doe',
        email: 'jane@example.com',
      },
      {
        name: 'Piyush',
        email: 'piyush@example.com',
      },
    ],
    _id: '617a077e18c25468bc7cfdd4',
    chatName: 'Jane Doe',
  },
  {
    isGroupChat: true,
    users: [
      {
        name: 'John Doe',
        email: 'jon@example.com',
      },
      {
        name: 'Piyush',
        email: 'piyush@example.com',
      },
      {
        name: 'Guest User',
        email: 'guest@example.com',
      },
    ],
    _id: '617a518c4081150016472c78',
    chatName: 'Chill Zone',
    groupAdmin: {
      name: 'Guest User',
      email: 'guest@example.com',
    },
  },
]
