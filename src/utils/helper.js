/* eslint-disable prefer-destructuring */
const Minio = require('minio');
const { default: axios } = require('axios');
const { slackChannels } = require('../config/config');
const config = require('../config/config');

/* eslint-disable import/prefer-default-export */
const randomNum = (min, mx) => {
  const max = mx + 1;
  return Math.floor(Math.random() * (max - min)) + min; // You can remove the Math.floor if you don't want it to be an integer
};

const getUserRoom = (id) => {
  return `user-id-${id}`;
};
const getVisitRoom = (id) => {
  return `visit-id-${id}`;
};
const getObservationRoom = (id) => {
  return `observation-id-${id}`;
};
const getBasketRoom = (id) => {
  return `basket-id-${id}`;
};
const getAllParams = (req) => {
  let token;
  if (req.headers.Authorization) {
    token = req.headers.Authorization.split(' ')[1];
    // console.log('Authorization', token);
  }
  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
    // console.log('authorization', token);
  }

  return { ...req.query, ...req.body, ...req.params, ...(token && { token }) };
};

const notifySlack = async ({ text, storeId, isAlert }) => {
  if (!storeId) throw Error('StoreId not provided for notifySlack');

  const id = storeId * 1;
  let url;
  if (id === 1) url = isAlert ? slackChannels.ws29_alerts : slackChannels.ws29;

  if (id === 2) url = slackChannels.gebit;
  if (id === 3) url = slackChannels.edeka;
  if (id === 4) url = slackChannels.smark;

  return axios({
    method: 'post',
    url,
    data: { text },
    headers: { 'Content-type': 'application/json' },
  });
};

const minioClient = new Minio.Client({
  endPoint: config.minio.endpoint,
  port: 443,
  useSSL: true,
  accessKey: config.minio.auth.accessKey,
  secretKey: config.minio.auth.secretKey,
});

const getPublicUrl = (bucketName, filePath) => {
  console.log('getPublicUrl--->', bucketName, filePath);
  return new Promise((resolve, reject) => {
    minioClient.presignedUrl('GET', bucketName, filePath, 24 * 60 * 60, function (err, presignedUrl) {
      if (err) {
        reject(err);
        return console.log(err);
      }
      console.log(presignedUrl);
      resolve(presignedUrl);
    });
  });
};
const getBucketFileFromFolder = async (bucketName, fileName) => {
  console.log('getBucketFileFromFolder--->', bucketName, fileName);
  const objectsList = await new Promise((resolve, reject) => {
    const objectsListTemp = [];
    const stream = minioClient.listObjectsV2(bucketName, fileName, true, '');

    stream.on('data', (obj) => objectsListTemp.push(obj.name));
    stream.on('error', reject);
    stream.on('end', () => {
      resolve(objectsListTemp);
    });
  });
  return objectsList;
};
const getVisitImagesList = async (visitId) => {
  // const response = await minioClient.listObjects(bucketName);
  // console.log('res-->', response.);
  const bucketName = config.minio.bucket.visit_images;
  console.log('getVisitImagesList--->', visitId, bucketName);
  const objectsList = await getBucketFileFromFolder(bucketName, visitId);
  const allPromises = [];
  objectsList.map((path) => allPromises.push(getPublicUrl(bucketName, path)));
  const list = await Promise.all(allPromises);
  // console.log('list-->', list);
  // presigned url for 'getObject' method.
  // expires in a day.
  return list;
};

const sendPushNotificationAPI = ({ title, subtitle, body, token, data }) => {
  return axios
    .post('https://api.expo.dev/v2/push/send', {
      ...(body && { body }),
      ...(data && { data }),
      ...(subtitle && { subtitle }),
      ...(title && { title }),
      to: token,
      sound: 'default',
      ttl: 8,
    })
    .then((res) => res)
    .catch((err) => ({ status: false, error: err.message }));
};
const kafka_server = 'http://bini.does-it.net:3000/v1';
const sendKafkaMessage = async (id) => axios.post(`${kafka_server}/kafka-message`, { userId: id }); // currently its visitId not userId
module.exports = {
  sendKafkaMessage,
  sendPushNotificationAPI,
  getAllParams,
  randomNum,
  getUserRoom,
  getVisitRoom,
  getObservationRoom,
  getBasketRoom,
  notifySlack,
  getVisitImagesList,
  getPublicUrl,
  getBucketFileFromFolder,
};
