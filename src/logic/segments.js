const User = require("../models/userData/user");
const Product = require("../models/catalogues/product");
const { getValue } = require("./conditions");


function getQuery(condition) {
    let upper = 0;
    let lower = 0;
    let value = '';
    if (condition.operator == 'BETWEEN') {
        let values = condition.value.split(',');
        upper = getCorrectValueType(values[1], condition.valueType);
        lower = getCorrectValueType(values[0], condition.valueType);
    } else {
        value = getValue(condition.source, condition.value, condition.valueType);
    }

    if (condition.valueType == "BOOLEAN") {
        value = value == true ? "TRUE" : "FALSE";
    }


    switch (condition.operator) {
        case "EQUALS":
        case "==":
            return `{"data.${condition.field}": "${value}"}`;
        case "IN":
        case "in":
            return `{"data.${condition.field}": {"$in": ["${value}"]}}`;
        case "NOT_EQUALS":
        case "!=":
            return `{"data.${condition.field}": {"$ne": "${value}"}}`;
        case "GREATER_THAN":
        case ">":
            return `{"data.${condition.field}": {"$gt": "${value}"}}`;
        case "LESS_THAN":
        case "<":
            return `{"data.${condition.field}": {"$lt": "${value}"}}`;
        case "GREATER_THAN_OR_EQUAL":
        case ">=":
            return `{"data.${condition.field}": {"$gte": "${value}"}}`;
        case "LESS_THAN_OR_EQUAL":
        case "<=":
            return `{"data.${condition.field}": {"$lte": "${value}"}}`;
        case "BETWEEN":
            return `{"data.${condition.field}": {"$gte": "${lower}", "$lte": "${upper}"}}`;
        default:
            return `{"data.${condition.field}": "${value}"}`;
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