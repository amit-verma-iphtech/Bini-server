const httpStatus = require('http-status');
const vision = require('@google-cloud/vision');
const fs = require('fs');
const https = require('https');
const ffmpeg = require('ffmpeg');
const { Storage } = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');
const ApiError = require('../utils/ApiError');
const { models } = require('../sequelize');
const imageService = require('./image.service');
const { item } = require('../models');
const { ItemService } = require('.');

// const path = require('path');

/*
{
    "type": "service_account",
    "project_id": "evocative-radar-159916",
    "private_key_id": "e47984ec88e12ad9f2e5dca4b17d2a34b014b8b4",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCmuxo0qkJK5eep\nIqNw6KBv91/aACG3Sv7PU8kzZ1qo2hTRMk4eiDo2C6OoefH1Diqt6+4jz+EQHA0q\nYh4O3tmOkPszYHMRxGeUAqHuJt6JeNfV0AiPzjIIDgqTMWohhZEyGve4aazJK21B\nq22Owz8tls5Pz5op6d1JDNj1PQi3wgiTRp/Yy1M33Z8FrPoMfjnRLdyk+l4+wiJs\nLay31Z4W0jmn3KygoS05c9cc4FDWzgG/r7UbZ8goTgJG3SuSoi2AcKmKzDtiglr0\nSFdai4GIvtRi2NKHWgk9KvjC0dq07+uSIx4szGJkrPuamn5rrY2u4lJOx9tN+YRh\n+PSsRFRTAgMBAAECggEABXVmJUtd6wdE30qlFDPaZicicUf2J/STb52t5XoZmQW1\n5G5VeBLDWuYr4Bs61y9RYkeGu3MV5vSBfEh2n5LJ3PP4u6MmAw9KAmKsyi1JQ8Am\nrprYJrEf4aX2Qh1MbrdNBwQWOuhxc48OBmDfIcCSHONCrAKUk3SaPeNm9Px1R8ZZ\n/Ci8Kv/WY1U1tEeruPkPREF9LKIyMk/jpnd8g3PObmUB4dqYmJknlpg/uP5cdIwq\nMc3rne+OJsb9RV5J1ZTtuCsGxEcAd6HPXMg37h+/muZCUjbawgFj18XGeNrRGP9w\nGtCHEOTwyzi19Af47ZyYYWIBBXX8dum72+w241bK0QKBgQDaAvgiZN67L+f72Mr9\ntMz6lt4lxerwGT+U9mtH0HH5Yuyhm0zjsE3v24uhlCuVrnP7hK3sS1A4SOBeA5ag\ng0rYY0MnwWU0KD2zRl5+5APhqeZpn8KHxUZzJx1BAmLb3MjVNk74qbNmkSXnwbgO\nQSzEocj4zkhQYOQ/qH2s7Ct8kQKBgQDDyJwH/Majn7pH/qFv2ONnJZfhdv6nY7Hz\nc0b5N7cY1/GEzZtI5HM4TlfE3Cs96M9CtMW7mXjuYCnwV47xNSboimLrtRSc+fOk\nU9ytBnXCg2vSfQCvtsHa2CEOn298LAaVBPq0o0PXVIgEjzsNk6DqK3wUXuW5O1DR\n2oCxHGXEowKBgCPDfu8tevhcKINBEjPCeCnXnAO4Tw0qJysJrZmvUTMnDkiIkHl9\nj5t8eZB9HRVF9BLbtihgRn2lPuFNV2VnhFyxE/AuoqqGu3BwZ8oLH7PiSkEjiyb4\nrtDvJrZmbM9CjdOkQBo8xIhb4Ur+lXIJMQ3kuHJQbL561pa2zj8S0yNxAoGAUgJq\nOX5MxqVVpmqmvO8g8kfxAuSRbxR3qf6TsDkCXUm3RWXKshHfoapPYYrIIjqu9sY6\nPYbf/RoS9zX2DluxXJ77KLjFVavtvtvSCDg4g64BMD5kVzY6paz6y+FFFcJrT2iy\ni5AIDt69ywskNV+te+mTJAVMPPb3t6/LUGUQy/kCgYEAkqJa3B2JfiLB3jTLIwM+\n9yzor4Q8C0z17TLI9UnxgNl15zLcfnGCqEkq+Z1BocPYdjwke3FrvndRj3w2dfRj\nl6qRzy7zwtpvWBVO+ulNWCV8jUA9yMVCm4b153PyT/LJSsPeyTvMAsdcNqEhyfDx\nHazWNLqX08q/DxqIZRxNbpo=\n-----END PRIVATE KEY-----\n",
    "client_email": "187663318700-compute@developer.gserviceaccount.com",
    "client_id": "116398935276327418278",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/187663318700-compute%40developer.gserviceaccount.com"
}
*/

// Creates a client
const client = new vision.ProductSearchClient();
const projectId = 'probable-analog-301220';
const location = 'europe-west1';

// XXX Needs to be based on upload request
const productSetId = 'groceries';
const productSetDisplayName = 'First product set';

const productSearchClient = new vision.ProductSearchClient();
const imageAnnotatorClient = new vision.ImageAnnotatorClient();
const bucketName = 'bini-products-bucket';
const keyFilename = './gcpconfig.json';

// Creates a client from a Google service account key.
// const storage = new Storage({ keyFilename });
const storage = new Storage({
  projectId,
  keyFilename,
});

const bucket = storage.bucket(bucketName);

const createUploadUrl = async (req, res) => {
  const { file } = req.query;
  const { type } = req.query;

  if (!file) {
    res.code(400);
    res.send("include filename as 'file' query param");
    return;
  }
  if (!type) {
    res.code(400);
    res.send("include content-type as 'type' query param");
    return;
  }

  bucket.file(file).getSignedUrl(
    {
      action: 'write',
      expires: Date.now() + 6000000,
      contentType: type,
    },
    (error, signedUrl) => {
      if (error == null) {
        res.send(signedUrl);
      } else {
        res.code(400);
        res.send('error');
      }
    }
  );

  return null;
};

const createProductSet = async (productSetId, productSetDisplayName) => {
  // Resource path that represents Google Cloud Platform location.
  const locationPath = client.locationPath(projectId, location);

  const productSet = {
    displayName: productSetDisplayName,
  };

  const request = {
    parent: locationPath,
    productSet,
    productSetId,
  };

  const [createdProductSet] = await client.createProductSet(request);
  return createdProductSet;
};

const createProduct = async (productId, productCategory, productDisplayName) => {
  // Resource path that represents Google Cloud Platform location.
  const locationPath = client.locationPath(projectId, location);

  const product = {
    displayName: productDisplayName,
    productCategory,
  };

  const request = {
    parent: locationPath,
    product,
    productId,
  };

  const [createdProduct] = await client.createProduct(request);

  return createdProduct;
};

const addProductToProductSet = async (productId, productSetId) => {
  const productPath = client.productPath(projectId, location, productId);
  const productSetPath = client.productSetPath(projectId, location, productSetId);

  const request = {
    name: productSetPath,
    product: productPath,
  };

  await client.addProductToProductSet(request);
};

const createReferenceImage = async (gcsUri, referenceImageId) => {
  const formattedParent = client.productPath(projectId, location, productId);

  const referenceImage = {
    uri: gcsUri,
  };

  const request = {
    parent: formattedParent,
    referenceImage,
    referenceImageId,
  };

  const [response] = await client.createReferenceImage(request);
};

const getSimilarProductsFile = async (filter, content) => {
  const projectId = 'probable-analog-301220';
  const productCategory = 'packagedgoods-v1';
  const productSetId = 'groceries';

  const productSetPath = productSearchClient.productSetPath(projectId, location, productSetId);
  // const content = fs.readFileSync(filePath, 'base64');

  const request = {
    // The input image can be a GCS link or HTTPS link or Raw image bytes.
    // Example:
    // To use GCS link replace with below code
    // image: { source: { gcsImageUri: filePath } },
    // To use HTTP link replace with below code
    // image: {source: {imageUri: filePath}}
    // To use raw image bytes replace with below code
    image: { content },
    features: [{ type: 'PRODUCT_SEARCH' }],
    imageContext: {
      productSearchParams: {
        productSet: productSetPath,
        productCategories: [productCategory],
        filter,
      },
    },
  };
  const [response] = await imageAnnotatorClient.batchAnnotateImages({
    requests: [request],
  });
  let { results } = response.responses[0].productSearchResults;
  results.forEach((result) => {});

  results = results.map(({ product: { name } }) => ({
    product: { name: name.replace('projects/probable-analog-301220/locations/europe-west1/products/', '') },
  }));

  return results;
};

const uploadFile = async (localFilePath, itemId, options) => {
  options = options || {};

  // const fileName = path.basename(localFilePath);
  // const file = bucket.file(fileName);

  const uploadedFile = await bucket.upload(localFilePath, options);

  imageService.createImage({
    url: uploadedFile[0].publicUrl(),
    itemId,
  });

  // .then(() => file.makePublic()); // not needed becaues access level is defined per bucket as a whole
};

const uploadFiles = async (dir, itemId, optinalNewItemName, options) => {
  let newItem;
  if (itemId === undefined) {
    newItem = await ItemService.createItem({
      name: optinalNewItemName,
      description: '',
      price: 0.0,
      discountedPrice: 0.0,
      categoryId: 0,
      storeId: 0,
      stock: 0,
      active: false,
      imageUrl: false,
      url: '',
    });
  }

  const applicableItemId = itemId || newItem.id;

  fs.readdir(dir, function (err, files) {
    if (err) {
      console.error('Could not list the directory.', err);
    }

    files.forEach(function (file, index) {
      const localFilePath = `${dir}/${file}`;

      const status = fs.statSync(localFilePath);
      if (status.isFile()) {
        uploadFile(localFilePath, applicableItemId, options);
      }
    });
  });
};

const processVideo = async (url, itemId, optinalNewItemName, options) => {
  const uuid_filename = uuidv4();
  const uuid_filepath = `./temporary-files/${uuid_filename}.mp4`;
  const directoryTargetFrames = `./temporary-files/processed/${uuid_filename}`;

  if (!fs.existsSync(directoryTargetFrames)) {
    fs.mkdirSync(directoryTargetFrames);
  }

  options = options || {};

  const file = fs.createWriteStream(uuid_filepath);

  const request = https.get(url, function (response) {
    const stream = response.pipe(file);

    stream.on('finish', function () {
      stream.close();

      try {
        // var process = new ffmpeg(uuid_filepath);
        const process = new ffmpeg(uuid_filepath);
        process.then(
          async function (video) {
            const created = await video.fnExtractFrameToJPG(directoryTargetFrames, {
              number: 5,
              every_n_seconds: 20,
              file_name: `frame_${uuid_filename}_%s`,
              // }, uploadFiles(directoryTargetFrames, options))
              // }, uploadFiles())
            });

            uploadFiles(directoryTargetFrames, itemId, optinalNewItemName, options);
          },
          function (err) {}
        );
      } catch (e) {}

      /*
            try {
                //var process = new ffmpeg(uuid_filepath);
                var process = new ffmpeg("./temporary-files/test.mp4");
                process.then(function (video) {
                    const created = video.fnExtractFrameToJPG(directoryTargetFrames, {
                        number : 5,
                        every_n_seconds: 20,
                        file_name : 'my_frame_%t_%s',
                    }, uploadFiles(directoryTargetFrames, options))
                }, function (err) {
                });
            } catch (e) {
            } */
    });
  });
};

module.exports = {
  createUploadUrl,
  createProductSet,
  createProduct,
  addProductToProductSet,
  createReferenceImage,
  getSimilarProductsFile,

  processVideo,
  uploadFiles,
};
