const User = require("../models/catalogues/user");
const { evaluateConditions } = require("./conditions");



function getQuery(condition) {

    if (condition.valueType == "BOOLEAN") {
        condition.value = condition.value == true ? "TRUE" : "FALSE";
    }

    switch (condition.operator) {
        case "EQUALS":
        case "==":
            return `{"data.${condition.field}": "${condition.value}"}`;
        case "IN":
        case "in":
            return `{"data.${condition.field}": {"$in": ["${condition.value}"]}}`;
        case "NOT_EQUALS":
        case "!=":
            return `{"data.${condition.field}": {"$ne": "${condition.value}"}}`;
        case "GREATER_THAN":
        case ">":
            return `{"data.${condition.field}": {"$gt": "${condition.value}"}}`;
        case "LESS_THAN":
        case "<":
            return `{"data.${condition.field}": {"$lt": "${condition.value}"}}`;
        case "GREATER_THAN_OR_EQUAL":
        case ">=":
            return `{"data.${condition.field}": {"$gte": "${condition.value}"}}`;
        case "LESS_THAN_OR_EQUAL":
        case ">=":
            return `{"data.${condition.field}": {"$lte": "${condition.value}"}}`;
        default:
            return `{"data.${condition.field}": "${condition.value}"}`;
    }
}

async function getUserSegment(tree) {
    let querys = [] ;
    tree.conditions.forEach(conditionGroup => {
        let tempQuery = conditionGroup.map(condition => {
            return getQuery(condition);
        }).join(",");
        querys.push(`{"$and": [${tempQuery}]}`);
    });
    let query = `{"$or": [${querys.join(",")}]}`;
    let objectQuery = JSON.parse(query);    
    let users = await User.find(objectQuery);   

    return users;
}

module.exports = { getUserSegment }