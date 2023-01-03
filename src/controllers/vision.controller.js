const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { visionService } = require('../services');

const createUploadUrl = catchAsync(async (req, res) => {
  return await visionService.createUploadUrl(req, res);
});

const createProductSet = catchAsync(async (req, res) => {
  const createdProductSet = await visionService.createProductSet(req.body.productSetId, req.body.productSetDisplayName);
  res.status(httpStatus.OK).send(createdProductSet);
});

const createProduct = catchAsync(async (req, res) => {
  console.log(`req.body.productCategory${req.body.productCategory}`);
  const createdProduct = await visionService.createProduct(
    req.body.productId,
    req.body.productCategory,
    req.body.productDisplayName
  );
  res.status(httpStatus.OK).send(createdProduct);
});

const addProductToProductSet = catchAsync(async (req, res) => {
  const result = await visionService.addProductToProductSet(req.body.productId, req.body.productSetId);
  res.status(httpStatus.OK).send(result);
});

const createReferenceImage = catchAsync(async (req, res) => {
  const result = await visionService.createReferenceImage(req.body.gcsUri, req.body.referenceImageId);
  res.status(httpStatus.OK).send(result);
});

const getSimilarProductsFile = catchAsync(async (req, res) => {
  const result = await visionService.getSimilarProductsFile(req.body.filter, req.body.content);
  res.status(httpStatus.OK).send(result);
});

const processVideo = catchAsync(async (req, res) => {
  console.log(`req.query.url:${req.query.url}`);
  console.log(`req.query.itemId:${req.query.itemId}`);
  console.log(`req.query.optinalNewItemName:${req.query.optinalNewItemName}`);

  const result = await visionService.processVideo(req.query.url, req.query.itemId, req.query.optinalNewItemName, {});
  res.status(httpStatus.OK).send(result);
});

module.exports = {
  createUploadUrl,
  createProductSet,
  createProduct,
  addProductToProductSet,
  createReferenceImage,
  getSimilarProductsFile,

  processVideo,
};
