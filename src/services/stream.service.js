const Stream = require('node-rtsp-stream');

const getStream = async (data) => {
  try {
    // return { status: true };
    const stream = new Stream({
      name: 'name',
      streamUrl: 'rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov',
      wsPort: 9999,
      ffmpegOptions: {
        // options ffmpeg flags
        '-stats': '', // an option with no neccessary value uses a blank string
        '-r': 30, // options with required values specify the value after the key
      },
    });
    return stream;
  } catch (error) {
    return { status: false, error };
  }
};

module.exports = { getStream };
