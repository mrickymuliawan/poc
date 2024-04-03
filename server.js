require('dotenv').config();
var io = require('socket.io-client');
var socket = io.connect(process.env.SOCKET_SERVER_HOST, { reconnect: true });
const rtsp = require('rtsp-ffmpeg');
const fs = require('fs');
// const sharp = require('sharp');
var Jimp = require("jimp");

var stream = new rtsp.FFMpeg({
  input: process.env.CAMERA_HOST,
  rate: 3, // output framerate (optional)
  resolution: '640x480', // output resolution in WxH format (optional)
  quality: 1,
});

var pipeStream = function (data) {
  // Jimp.read(data).then(image => {
  //   const x = image
  //     .resize(640, 320) // resize
  //     .quality(100) // set JPEG quality
  //     .brightness(0.1) // set greyscale
  //     // .contrast(0.1) // set greyscale
  //     .write("jimp.jpg")
  //     .getBase64(Jimp.AUTO, function (err, src) {
  //       const json = {
  //         image: src,
  //         outletId: 35,
  //       }
  //       socket.emit('stream-pic', JSON.stringify(json));
  //     })

  // })
  // sharp(data).rotate().toFile('output.jpg', (err, info) => console.log(info))

  const base64String = 'data:image/png;base64,' + data.toString('base64')
  let base64Image = base64String.split(';base64,').pop();

  fs.writeFile('image.png', base64Image, { encoding: 'base64' }, function (err) {
    console.log('File created');
  });
  const json = {
    image: base64String,
    outletId: 35,
    camType: 2
  }
  socket.emit('stream-pic', JSON.stringify(json));
};
stream.on('data', pipeStream);

socket.on('connect', function (socket) {
  console.log('Connected!');
});

socket.on('disconnect', () => {
  stream.removeListener('data', pipeStream);
  console.log('user disconnected: ', socket.id);
});
