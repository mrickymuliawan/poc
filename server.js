require('dotenv').config();
var io = require('socket.io-client');
var socket = io.connect(process.env.SOCKET_SERVER_HOST, { reconnect: true });
const { spawn } = require('child_process');
// const ffmpeg = require('fluent-ffmpeg');

// console.log(process.env.SOCKET_SERVER_HOST);

const ffmpegProcess = spawn(
  'ffmpeg',
  [
    '-i',
    process.env.CAMERA_HOST,
    '-vf',
    'scale=640:480',
    '-r',
    '1',
    '-f',
    'image2pipe',
    '-vcodec',
    'mjpeg',
    '-',
  ],
  {
    stdio: ['ignore', 'pipe', 'ignore'],
  },
);

ffmpegProcess.stdout.on('data', (data) => {
  // Convert frame to base64
  console.log(data);
  // const base64Frame = Buffer.from(data).toString('base64');
  // Send frame to client
  // console.log('data:image/png;base64,' + base64Frame);
  // require("fs").writeFile("out.png", 'data:image/png;base64,' + base64Frame, 'base64', function (err) {
  //   console.log(err);
  // });

  // socket.emit(
  //   'stream-pic',
  //   JSON.stringify({ image: base64Frame, outletId: 2 }),
  // );
});

// // Set up the RTSP stream
// ffmpeg(`${process.env.CAMERA_HOST}`)
//   .inputFormat('rtsp')
//   .videoCodec('mjpeg')
//   .size('640x480')
//   .fps(1)
//   .on('data', (data) => {
//     // Encode the video data to base 64
//     console.log(data);
//     const base64Data = data.toString('base64');

//     // Send the base 64 data to the client
//     socket.emit('stream-pic', base64Data);
//   });

socket.on('connect', function (socket) {
  console.log('Connected!');
});

socket.on('disconnect', () => {
  console.log('user disconnected: ', socket.id);
});
