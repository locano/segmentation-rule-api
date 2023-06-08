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
        value = value == true ? "true" : "false";
    }

    let queryValue = condition.valueType == "STRING" ? `"${value}"` : value;
    switch (condition.operator) {
        case "EQUALS":
        case "==":
            return `{"${condition.field}": ${queryValue}}`;
        case "IN":
        case "in":
            return `{"${condition.field}": {"$in": [${queryValue}]}}`;
        case "NOT_EQUALS":
        case "!=":
            return `{"${condition.field}": {"$ne": ${queryValue}}}`;
        case "GREATER_THAN":
        case ">":
            return `{"${condition.field}": {"$gt": ${queryValue}}}`;
        case "LESS_THAN":
        case "<":
            return `{"${condition.field}": {"$lt": ${queryValue}}}`;
        case "GREATER_THAN_OR_EQUAL":
        case ">=":
            return `{"${condition.field}": {"$gte": ${queryValue}}}`;
        case "LESS_THAN_OR_EQUAL":
        case "<=":
            return `{"${condition.field}": {"$lte": ${queryValue}}}`;
        case "BETWEEN":
            return `{"${condition.field}": {"$gte": ${lower}, "$lte": ${upper}}}`;
        default:
            return `{"${condition.field}": ${queryValue}}`;
    }
}

async function getUserSegment(tree,testUsers) {
    let querys = [];
    tree.conditions.forEach(conditionGroup => {
        let tempQuery = conditionGroup.map(condition => {
            return getQuery(condition);
        }).join(",");
        querys.push(`{"$and": [${tempQuery}]}`);
    });
    let query = `{"$or": [${querys.join(",")}]}`;
    let objectQuery = JSON.parse(query);
    let users = await User.find(objectQuery).limit(testUsers);
    return users;
}

async function getOutputs(node) {
    let querys = [];
    let query = '{}';
    let sortQuerys = [];
    let sortQuery = '{}';
    node.conditions.forEach(conditionGroup => {
        let tempQuery = conditionGroup.map(condition => {
            return getQuery(condition);
        }).join(",");
        querys.push(`{"$and": [${tempQuery}]}`);
    });

    query = `{"$or": [${querys.join(",")}]}`;
    if (node.sorts && node.sorts.length > 0) {
        node.sorts.forEach(sort => {
            let tempQuery = `"${sort.field}": ${sort.order == "ASC" ? 1 : -1}`;
            sortQuerys.push(tempQuery);
        });
        sortQuery = `{${sortQuerys.join(",")}}`;
    }

    let objectQuery = JSON.parse(query);
    let sortObjectQuery = JSON.parse(sortQuery);
    let products = await Product.find(objectQuery).sort(sortObjectQuery);

    return products;
}

async function getContextValue(field) {
    return variables[field];
}

module.exports = { getUserSegment, getOutputs }