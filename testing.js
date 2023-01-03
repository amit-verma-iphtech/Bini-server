const Minio = require('minio');

const config = {
  minio: {
    endpoint: 'http://172.28.224.3',
    auth: {
      accessKey: 'minioadmin',
      secretKey: 'minioadmin',
    },
    bucket: {
      visits: 'entrance-bounding-boxes',
      cameras: 'cameras',
    },
  },
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
  const bucketName = config.minio.bucket.visits;
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

getVisitImagesList('69');
