require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('image');
const getStream = require('into-stream');
const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = { bufferSize: 4 * ONE_MEGABYTE, maxBuffers: 20 };

// azure config
const containerName = 'images';
const { BlobServiceClient, newPipeline, StorageSharedKeyCredential } = require('@azure/storage-blob');
const azureStorage = require('azure-storage');
const sharedKeyCredential = new StorageSharedKeyCredential(
  process.env.AZURE_STORAGE_ACCOUNT_NAME,
  process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY
);
const pipeline = newPipeline(sharedKeyCredential, {
  keepAliveOptions: {
    enable: false,
  },
});
const blobServiceClient = new BlobServiceClient(
  `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net`,
  pipeline
);
const tableSvc = azureStorage.createTableService(
  process.env.AZURE_STORAGE_ACCOUNT_NAME,
  process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY
);
const tableName = 'imageOpacity';
const entGen = azureStorage.TableUtilities.entityGenerator;

// app setup
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
const getBlobName = require('./blobHelper');

app.post('/', uploadStrategy, async (req, res) => {
  const blobName = getBlobName(req.file.originalname);
  const stream = getStream(req.file.buffer);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  try {
    await blockBlobClient.uploadStream(stream, uploadOptions.bufferSize, uploadOptions.maxBuffers);

    const imageEntity = {
      PartitionKey: entGen.String('images'),
      RowKey: entGen.String(blobName),
      opacity: entGen.String('1.0'),
    };
    tableSvc.insertOrMergeEntity(tableName, imageEntity, (error, result, response) => {
      if (!error) {
        console.log('successfully created file');
      }
    });

    const url = `https://imageupload22.blob.core.windows.net/images/${blobName}`;
    res.send({ filename: url });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get('/', async (req, res, next) => {
  let blobResponseData = [];

  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const listBlobsResponse = await containerClient.listBlobFlatSegment();

    if (listBlobsResponse.segment.blobItems.length) {
      blobResponseData = listBlobsResponse.segment.blobItems;
    }

    const query = new azureStorage.TableQuery().where('PartitionKey eq ?', 'images');
    tableSvc.queryEntities(tableName, query, null, (error, result, response) => {
      if (!error) {
        let fileArray = [];
        blobResponseData.forEach((image) => {
          let entry = result.entries.find((el) => el.RowKey._ == image.name);
          if (entry) {
            let fileItem = {
              image: image,
              opacity: entry.opacity._,
            };
            fileArray.push(fileItem);
          }
        });

        res.send(fileArray);
      }
    });
  } catch (err) {
    res.status(500);
  }
});

app.post('/:filename/:opacity', async (req, res, next) => {
  const imageEntity = {
    PartitionKey: entGen.String('images'),
    RowKey: entGen.String(req.params.filename),
    opacity: entGen.String(req.params.opacity),
  };

  tableSvc.insertOrMergeEntity(tableName, imageEntity, (error, result, response) => {
    if (!error) {
      res.status(200).send(req.params.opacity);
    } else {
      console.log('error writing opacity to azure table storage', error);
      res.status(500).send();
    }
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('running on port ' + port);
});
