const avro = require('avsc');

const { default: axios } = require('axios');
const httpStatus = require('http-status');
const { date } = require('joi');
// const Kafka = require('node-rdkafka');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');

// const ws29Server = 'http://localhost:8000/v1';
// const eventType = avro.Type.forSchema({
//   type: 'record',
//   fields: [
//     {
//       name: 'pos_id',
//       type: 'string',
//     },
//     {
//       name: 'ts',
//       type: 'string',
//     },
//     {
//       name: 'source',
//       type: { type: 'enum', symbols: ['sourec'] },
//     },
//   ],
// });
// const sendEntranceLog = async ({ data }) => {
//   try {
//     // bini.does-it.net:9092 or 93.242.146.43:9092
//     const stream = Kafka.Producer.createWriteStream(
//       {
//         'metadata.broker.list': '93.242.146.43:9092',
//       },
//       {},
//       { topic: 'entrance_log' }
//     );
//     const d = new Date();
//     d.getFullYear(); // Get the year as a four digit number (yyyy)
//     d.getMonth(); // Get the month as a number (0-11)
//     d.getDate(); // Get the day as a number (1-31)
//     d.getHours(); // Get the hour (0-23)
//     d.getSeconds(); // Get the second (0-59)
//     d.getMinutes(); // Get the minute (0-59)
//     d.getMilliseconds(); // Get the millisecond (0-999)
//     d.getTime();
//     // 2020-06-19 10:34:45
//     const date = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}-${d.getSeconds()}-${d.getMinutes()}
//     `;
//     const data = {
//       pos_id: '1',
//       ts: date,
//       source: 'sourec',
//     };

//     const success = stream.write(eventType.toBuffer(data));
//     if (success) {
//       console.log('entrance_log-success');
//     } else {
//       console.error('entrance_log-fail');
//     }
//     return { status: true, message: 'success' };
//   } catch (error) {
//     return { status: false, message: error.message };
//   }
// };

// const admin = require('firebase-admin');

// const serviceAccount = require("firebaseconfig.json");
// const { verifyToken } = require("./token.service");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://fbauthdemo-2a451.firebaseio.com"
// });

const catchAsync = require('../utils/catchAsync');
const { getUserRoom, notifySlack, sendKafkaMessage } = require('../utils/helper');
const { getIoMobile } = require('../socket/Mobile/helper/mobile.socket.helper');
const { SOCKET_MESSAGE, SOCKET_EMIT_TYPE } = require('../constants/socket.constants');
const { slackChannels } = require('../config/config');
const { gebitCheckIn } = require('./gebit.service');
const { visitService } = require('.');
// const { createVisit } = require('../controllers/visit.controller');
const services = require('.');

const createVisit = async (data) => {
  const visit = await visitService.createVisit(data);
  if (!visit.alreadyExist) await services.basketService.createBasket(data, visit);
  return visit;
};
/**
 * Unlocks a door
 * @param {Object} smartlockId
 * @returns {Promise<Response>}
 */
const notify = async (data) => {
  const { text, storeId, isAlert } = data;
  let response = {
    message: 'waiting=response',
  };
  await notifySlack({ text: `${text}, storeId-${storeId}`, isAlert, storeId })
    .then((res) => {
      console.log('Notification sent to common channel');
      response = { status: true, message: 'Notification sent successfully' };
    })
    .catch((err) => {
      console.error('Notification not sent to common channel');
      response = { status: false, message: 'Failed to send notification', err: err.message };
    });
  return response;
};
const sendPushNotification = async (data) => {
  const { text, storeId, isAlert } = data;
  let response = {
    message: 'waiting=response',
  };
  await notifySlack({ text: `${text}, storeId-${storeId}`, isAlert, storeId })
    .then((res) => {
      console.log('Notification sent to common channel');
      response = { status: true, message: 'Notification sent successfully' };
    })
    .catch((err) => {
      console.error('Notification not sent to common channel');
      response = { status: false, message: 'Failed to send notification', err: err.message };
    });
  return response;
};

const unlockDoor = async (data) => {
  let decodedData;
  try {
    decodedData = jwt.verify(data.token, process.env.JWT_SECRET);
    console.log('decodedData', decodedData);
  } catch (error) {
    console.log('JWT ERROR : ', error.message);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }
  const { storeId } = data;
  const visitPayload = {
    start: new Date(),
    userId: decodedData.sub,
    storeId,
    noErrorThrow: true,
  };
  const visitResponse = await createVisit(visitPayload);
  // console.log('visit Respionse--->', visitResponse);
  const { id: visitId } = visitResponse;
  console.log('visitId->', visitId);
  try {
    // await verifyToken(req.headers.authtoken);
    await axios.post(
      `https://api.nuki.io/smartlock/${data.smartlockId}/action/unlock`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${process.env.NUKI_API_KEY}`,
        },
      }
    );
  } catch (error) {
    console.error('nukiResponse fail', error.message);
  }
  const text = `Knock knock! Customer ${data.userData.name}-${data.userData.id} just entered the store. 🚦🏃‍♀️🏃‍♂️🤴`;

  await notifySlack({ text, storeId, isAlert: true })
    .then((res) => console.log(`Notification sent to store: ${storeId} channel`))
    .catch((err) => console.error(`Notification not sent to store: ${storeId} channel`));

  console.log('reponse-->', 'notifySlack success');

  const userId = decodedData.sub;
  const userRoom = getUserRoom(userId);
  const io = getIoMobile();

  io.to(userRoom).emit(SOCKET_MESSAGE, {
    type: SOCKET_EMIT_TYPE.SOCKET_CHECK_IN,
    data: { status: true },
  });
  
  // const kafkaResposne = await sendEntranceLog({ data });
  let storeResponse;
  // if (storeId === '1') await sendWs29(visitId);
  if (storeId === '1') await sendKafkaMessage(visitId).catch((err) => console.log('sendKafkaMessageErr', err.message));
  // if (storeId === '3') storeResponse = await gebitCheckIn();
  
  return { status: true, message: 'Unlock door success', storeResponse };
};

module.exports = {
  unlockDoor,
  notify,
  sendPushNotification,
};
