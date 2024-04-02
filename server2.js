require('dotenv').config();
var io = require('socket.io-client');
var socket = io.connect(process.env.SOCKET_SERVER_HOST, { reconnect: true });
const rtsp = require('rtsp-ffmpeg');
const fs = require('fs');
var stream = new rtsp.FFMpeg({
  input: process.env.CAMERA_HOST,
  rate: 5, // output framerate (optional)
  resolution: '640x480', // output resolution in WxH format (optional)
  // quality: 5,
});

var pipeStream = function (data) {
  const base64String = 'data:image/png;base64,' + data.toString('base64')
  let base64Image = base64String.split(';base64,').pop();

  fs.writeFile('image.png', base64Image, { encoding: 'base64' }, function (err) {
    console.log('File created');
  });
  // socket.emit('data', data.toString('base64'));
};
stream.on('data', pipeStream);

socket.on('connect', function (socket) {
  console.log('Connected!');
});

socket.on('disconnect', () => {
  stream.removeListener('data', pipeStream);
  console.log('user disconnected: ', socket.id);
});
