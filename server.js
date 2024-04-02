require('dotenv').config()
const cors = require("cors")
const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
const dayjs = require('dayjs')
const fs = require('fs');

let app = express();
app.use(cors())

const httpServer = createServer(app);
const httpsServer = createServer({
  key: fs.readFileSync('./server.key'),
  cert: fs.readFileSync('./server.cert')
}, app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.on('connection', (socket) => {
  console.log('user connected: ', socket.id);

  socket.on('stream-pic', (payload) => {
    console.log('stream-pic:', dayjs().format('DD/MM/YYYY HH:mm:ss'));
    io.emit('stream-pic', payload)
  })
  socket.on('send-pic', (payload) => {
    console.log('send-pic:', dayjs().format('DD/MM/YYYY HH:mm:ss'));
    io.emit('send-pic', payload)
  })

  socket.on('recognized-pic', (payload) => {
    console.log('recognized-pic:', dayjs().format('DD/MM/YYYY HH:mm:ss'), payload,);
    io.emit('recognized-pic', payload)
  })

  socket.on('recognized-list', (payload) => {
    console.log('recognized-list:', dayjs().format('DD/MM/YYYY HH:mm:ss'), payload);
    io.emit('recognized-list', payload)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected: ', socket.id);
  })
});

httpServer.listen(process.env.PORT, () => {
  console.log('socket running on port ' + process.env.PORT);
});

httpsServer.listen(443, () => {
  console.log('server started at 443');
});