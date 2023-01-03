const httpStatus = require('http-status');
const { Sequelize } = require('sequelize');
const { minio } = require('../config/config');
const config = require('../config/config');
const { models } = require('../sequelize');
const ApiError = require('../utils/ApiError');
const { getPublicUrl, getBucketFileFromFolder } = require('../utils/helper');

const getShelf = async (data) => {
  // const getModel = basket();
  const { id } = data;
  const camera = await models.camera.findByPk(id, {
    plain: true,
    raw: true,
  });
  const compartments = await models.compartment2d.findAll({
    where: {
      cameraId: id,
    },
    attributes: ['id', 'itemId', 'x1', 'x2', 'x3', 'x4', 'y1', 'y2', 'y3', 'y4'],
  });
  const bucketName = minio.bucket;
  const publicLink = await getPublicUrl(bucketName.cameras, camera.imageLink);
  // const visitFiles = await getBucketFileFromFolder(bucketName.visits, '59');
  // const cameraFiles = await getBucketFileFromFolder(bucketName.cameras, 'hik4.png');
  // const allPromises = [];
  // cameraFiles.map((path) => allPromises.push(bucketName.cameras, getPublicUrl(bucketName.cameras, path)));
  // const list = await Promise.all(allPromises);
  return {
    shelf_image: publicLink,
    length: compartments.length,
    compartments,
  };
};
const getCameras = async (data) => {
  // const getModel = basket();
  const { storeId } = data;
  const cameras = await models.camera.findAll({
    where: {
      storeId,
    },
    attributes: ['id', 'imageLink'],
  });
  return {
    length: cameras.length,
    cameras,
  };
};

module.exports = {
  getShelf,
  getCameras,
};
