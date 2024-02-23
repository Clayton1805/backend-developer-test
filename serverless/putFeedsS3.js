require('dotenv').config();
const {
  S3Client,
  PutObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} = require('@aws-sdk/client-s3');

const checkBucketExists = async (S3, bucketName) => {
  try {
    const command = new HeadBucketCommand({ Bucket: bucketName });
    await S3.send(command);
    return true;
  } catch (err) {
    if (err.name === 'NotFound') {
      return false;
    }
    throw err;
  }
};

const putFeedsS3 = async (feeds) => {
  const S3 = new S3Client();

  const Bucket = process.env.BUCKET;

  const bucketExists = await checkBucketExists(S3, Bucket);

  if (!bucketExists) {
    const command = new CreateBucketCommand({ Bucket });
    await S3.send(command);
  }

  const command = new PutObjectCommand({
    Bucket,
    Key: process.env.KEY,
    Body: JSON.stringify(feeds),
    ContentType: 'application/json',
  });

  const responseS3 = await S3.send(command);

  return responseS3;
};

module.exports = { putFeedsS3 };
