const User = require("../models/userData/user");
const Product = require("../models/catalogues/product");


function getQuery(condition) {

    if (condition.valueType == "BOOLEAN") {
        condition.value = condition.value == true ? "TRUE" : "FALSE";
    }

    // if (condition.source == "CONTEXT_VARIABLE") {
    //     condition.value = getContextValue(condition.field);
    // }


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
        case "BETWEEN":
            let values = condition.value.split(",");
            return `{"data.${condition.field}": {"$gte": "${values[0]}", "$lte": "${values[1]}"}}`;
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

async function getOutputs(node) {
    let querys = [] ;
    node.conditions.forEach(conditionGroup => {
        let tempQuery = conditionGroup.map(condition => {
            return getQuery(condition);
        }).join(",");
        querys.push(`{"$and": [${tempQuery}]}`);
    });
    let query = `{"$or": [${querys.join(",")}]}`;


    let objectQuery = JSON.parse(query);    
    let products = await Product.find(objectQuery); 

    return products;
}

async function getContextValue(field) {
    return variables[field];
}

module.exports = { getUserSegment,getOutputs }