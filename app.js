require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const mongoose = require('mongoose')
const uri = process.env.MONGODB_URI;
const scoreRoutes = require('./routes/scoreRoutes')
const cors = require('cors')
const http = require('http')
const server = http.createServer(app)
const socketio = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
});
const PORT = process.env.PORT || 5000
const Score = require('./models/scoreModel')

mongoose.connect(uri)
mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB")
})
const client = mongoose.connection.client
const db = client.db('test')
const collection = db.collection('scores')
const changeStream = collection.watch()
changeStream.on('change', async (change) => {
    console.log("DB change detected, emit to websocket")
    socketio.emit('message', {name:'topscores', message:"update"})
})
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

//socket.io
socketio.on('connection', (socket) => {
    console.log('A user connected');
    
    //Send existing messages to connected client
    Score.find().then((scores) => {
        socket.emit('init', scores)
    })

    //Listen for new messages from the client
    socket.on('message', (msg) => {
        message.save().then(() => {
            io.emit('message', message)
        })
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected')
    })
})

//middlewares
app.use(cors())
app.use(morgan('tiny'))
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});
app.use(express.json())
app.use('/scores', scoreRoutes)
