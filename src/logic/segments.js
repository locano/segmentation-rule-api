const User = require("../models/userData/user");
const { getQuery } = require("./querys");

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


module.exports = { getUserSegment }