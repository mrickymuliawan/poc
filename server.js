require('dotenv').config()
var io = require('socket.io-client');
var socket = io.connect(process.env.SOCKET_SERVER_HOST, { reconnect: true });

const ffmpegProcess = spawn(
  'ffmpeg',
  [
    '-i',
    process.env.me,
    '-vf',
    'scale=640:480',
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
  const base64Frame = Buffer.from(data).toString('base64');
  // Send frame to client
  console.log('got image', base64Frame);
  socket.emit('send-stream', base64Frame);
});

socket.on('connect', function (socket) {
  console.log('Connected!');
});


socket.on('disconnect', () => {
  console.log('user disconnected: ', socket.id);
  ffmpegProcess.kill('SIGINT'); // Kill ffmpeg process when client disconnects
})
