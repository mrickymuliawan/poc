require('dotenv').config()
const cors = require("cors")
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: process.env.ORIGIN_URL,
  }
});
app.use(cors())

io.on('connection', (socket) => {
  if (process.env.APP_ENV == 'dev') {
    console.log('user connected');
  }
  socket.on('send-message', (payload) => {
    io.emit('receive-message', payload)
  })
  socket.on('read-message', (payload) => {
    io.emit('read-message', payload)
  })
  socket.on('disconnect', () => {
    if (process.env.APP_ENV == 'dev') {
      console.log('user disconnected');
    }
  })
});

http.listen(process.env.PORT, () => {
  console.log('socket running on port ' + process.env.PORT);
});
