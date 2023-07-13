
const AWS = require('aws-sdk');
function getMegabitesSize(data) {
    const jsonString = JSON.stringify(data);
    const size = new TextEncoder().encode(jsonString).length
    const kiloBytes = size / 1024;
    const megaBytes = kiloBytes / 1024;
    return megaBytes;
}

async function getResultData(results, name) {
    const megaBytes = getMegabitesSize(results);

    try {
        var s3 = new AWS.S3();
        let filename = `${name.replace(' ', '_')}_${(new Date().toJSON())}.json`
        var params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: filename,
            Body: JSON.stringify(results),
            Expires: 60 * 60
        }
        localParams = [params];
        await Promise.all(
            localParams.map(async (file) => {
                await s3.putObject(file, function (err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else console.log("Put to s3 should have worked: " + data);           // successful response
                }).promise()
            })
        );

        if (megaBytes > 5) {
            return {
                results: results.slice(0, 200),
                message: "Data size is greater than 4MB and has been saved in S3, you can see a preview in the results",
                stored: true,
                link: `https://${process.env.S3_BUCKET_NAME}/${filename}`
            }
        } else {
            return {
                results: results,
                message: "Data size is less than 4MB you can see the results",
                stored: true,
                link: `https://${process.env.S3_BUCKET_NAME}/${filename}`
            };
        }
    } catch (error) {
        return {
            results: [],
            message: error.message || "Error saving data in S3",
            stored: true
        };
    }



}


module.exports = { getResultData, getMegabitesSize };