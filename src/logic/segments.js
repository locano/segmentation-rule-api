const User = require("../models/userData/user");
const { getQuery } = require("./querys");
const AWS = require('aws-sdk');
const csv = require('csvtojson');


async function getUserSegment(conditions, limitUsers, testUser) {

    if (testUser) {
        let users = await User.find({ "msisdn": testUser });
        return users;
    }

    let querys = [];
    conditions.forEach(conditionGroup => {
        let tempQuery = conditionGroup.map(condition => {
            return getQuery(condition);
        }).join(",");
        querys.push(`{"$and": [${tempQuery}]}`);
    });
    let query = `{"$or": [${querys.join(",")}]}`;
    let objectQuery = JSON.parse(query);

    if (limitUsers) {
        let users = await User.find(objectQuery).limit(limitUsers);
        return users;
    }

    let users = await User.find(objectQuery);
    return users;

}

async function getUserFromBucket(path) {
    try {
        if (path == null) {
            return []
        }

        var s3 = new AWS.S3();
        let data = path.split("//");
        let bucket = data[1].split("/")[0];
        let key = path.split(bucket + "/")[1];

        var getParams = {
            Bucket: bucket, // your bucket name,
            Key: key // path to the object you're looking for
        }
        let stream = s3.getObject(getParams).createReadStream()
        // .on('error', (err) => reject(err))
        // .on('end', () => resolve());;

        // let stream = await new Promise((resolve, reject) => {
        //     const params = {
        //         Bucket: bucket, // your bucket name,
        //         Key: key // path to the object you're looking for
        //     }
        //     s3.getObject(params)
        //         .createReadStream()
        //         .on('error', (err) => reject(err))
        //         .on('end', () => resolve());
        // });

        const json = await csv().fromStream(stream);
        // console.log(json);
        return json;
    } catch (err) {
        console.error(err);
        return []
    }
}


module.exports = { getUserSegment, getUserFromBucket }