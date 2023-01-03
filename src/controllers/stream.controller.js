const catchAsync = require('../utils/catchAsync');
const { streamService } = require('../services');
const { getAllParams } = require('../utils/helper');

const getStream = catchAsync(async (req, res) => {
  try {
    const data = await getAllParams(req);
    const stream = await streamService.getStream(data);
    console.log('stream', stream);
    // return res.send(stream);
    return stream.pip(res);
  } catch (error) {
    return res.send({ error, message: 'Failed' });
  }
});

module.exports = {
  getStream,
};
