/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

'use strict';

const fs = require('fs');
const path = require('path');
const CONFIG = require('../../config');
const { FILE_UPLOAD_TYPE } = require('../utils/constants');

const fileUploadService = {};


/**
 * function to upload file to local server.
 */
fileUploadService.uploadFileToLocal = async (payload, fileName, pathToUpload, pathOnServer) => {
  const directoryPath = pathToUpload || path.resolve(`${__dirname}../../..${CONFIG.PATH_TO_UPLOAD_SUBMISSIONS_ON_LOCAL}`);
  // create user's directory if not present.
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
  const fileSavePath = `${directoryPath}/${fileName}`;
  const writeStream = fs.createWriteStream(fileSavePath);
  return new Promise((resolve, reject) => {
    writeStream.write(payload.file.buffer);
    writeStream.on('error', (err) => {
      reject(err);
    });
    writeStream.end((err) => {
      if (err) {
        reject(err);
      } else {
        const fileUrl = pathToUpload ? `${CONFIG.SERVER_URL}${pathOnServer}/${fileName}`
          : `${CONFIG.SERVER_URL}${CONFIG.PATH_TO_UPLOAD_SUBMISSIONS_ON_LOCAL}/${fileName}`;
        resolve(fileUrl);
      }
    });
  });
};

/**
 * function to upload a file on either local server or on s3 bucket.
 */
fileUploadService.uploadFile = async (payload, pathToUpload, pathOnServer) => {
  const fileNameArray = payload.file.originalname.split('.');
  const fileExtention = fileNameArray[fileNameArray.length - 1] || 'png';
  let fileName = `upload_${Date.now()}.${fileExtention}`; let
    fileUrl = '';

  if (payload.type == FILE_UPLOAD_TYPE.PROFILE_IMAGE) {
    fileName = `profile_${Date.now()}.${fileExtention}`;
  }
  if (payload.type == FILE_UPLOAD_TYPE.CHAT_MEDIA) {
    fileName = `${payload.groupId}/chat_${Date.now()}.${fileExtention}`;
  }

  if (CONFIG.UPLOAD_TO_S3_BUCKET) {
    fileUrl = await fileUploadService.uploadFileToS3(payload, fileName, CONFIG.S3_BUCKET.bucketName);
  } else {
    fileUrl = await fileUploadService.uploadFileToLocal(payload, fileName, pathToUpload, pathOnServer);
  }
  return fileUrl;
};

/**
 * function to get a file from s3(AWS) bucket.
 */
fileUploadService.getS3File = async (payload, bucketName) => new Promise((resolve, reject) => {
  // eslint-disable-next-line no-undef
  s3Bucket.getObject({ Bucket: bucketName || CONFIG.S3_BUCKET.bucketName, Key: payload.path }, (err, data) => {
    if (err) {
      if (err && err.code == 'AccessDenied') {
        resolve({ not_found: true });
      } else {
        console.log('S3 file getting error', err);
        reject(new Error('S3 file getting error'));
      }
    } else {
      resolve(data);
    }
  });
});

/**
* function to get link to upload file direct to s3
*/
fileUploadService.getLinkToUploadFileDirectToS3 = async (payload) => {
  const key = (payload.type == FILE_UPLOAD_TYPE.CHAT_MEDIA)
    // eslint-disable-next-line no-undef
    ? `${payload.groupId}/chat_${Date.now()}.${fileName}` : `profile_${Date.now()}.${fileName}`;

  const s3Params = {
    Bucket: CONFIG.S3_BUCKET.bucketName,
    Expires: 300, // time to expire in seconds - 5 min
    Fields: {
      Key: key,
    },
  };

  // eslint-disable-next-line no-undef
  const uploadData = await s3Bucket.createPresignedPost(s3Params);
  return uploadData;
};

module.exports = fileUploadService;
