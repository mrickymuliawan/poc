require('dotenv').config()
const cors = require("cors")
const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");

let app = express();
app.use(cors())

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.on('connection', (socket) => {
  console.log('user connected: ', socket.id);

  socket.on('stream-pic', (payload) => {
    console.log('stream-pic:');
    io.emit('stream-pic', payload)
  })
  socket.on('send-pic', (payload) => {
    console.log('send-pic:');
    io.emit('send-pic', payload)
  })

  socket.on('recognized-pic', (payload) => {
    console.log('recognized-pic:', payload);
    io.emit('recognized-pic', payload)
  })

  socket.on('recognized-list', (payload) => {
    console.log('recognized-list:', payload);
    io.emit('recognized-list', payload)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected: ', socket.id);
  })
});

httpServer.listen(process.env.PORT, () => {
  console.log('socket running on port ' + process.env.PORT);
});
