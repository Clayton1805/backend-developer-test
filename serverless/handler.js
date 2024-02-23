const { getRequest } = require('./getRequest');
const { putFeedsS3 } = require('./putFeedsS3');

module.exports.plooral = async () => {
  try {
    const feeds = await getRequest();
    const responseS3 = await putFeedsS3(feeds);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: { feeds, responseS3 },
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: error.message,
    };
  }
};
