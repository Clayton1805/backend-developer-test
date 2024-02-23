require('dotenv').config();
const { GetObjectCommand, S3Client } = require('@aws-sdk/client-s3');

class S3 {
  constructor() {
    this.client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
    });
  }

  async getFile() {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET,
      Key: process.env.KEY,
    });

    try {
      const response = await this.client.send(command);
      const str = await response.Body.transformToString();
      return str;
    } catch (err) {
      return null;
    }
  }
}

module.exports = { S3 };
