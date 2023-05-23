const AWS = require('aws-sdk');
const listBuckets = async () => {
    try {
        AWS.config.update({
            accessKeyId: process.env.aws_access_key_id,
            secretAccessKey: process.env.aws_secret_access_key,
            region: 'us-east-1',
          });
          
          // Call S3 to list the buckets
          s3 = new AWS.S3('.s3/s3-hn-raw-dev-digital');
          s3.listBuckets(function(err, data) {
            if (err) {
              console.log("Error", err);
            } else {
              console.log("Success", data.Buckets);
              
            }
          });
          
    } catch (e) {
    }
}

module.exports = listBuckets;