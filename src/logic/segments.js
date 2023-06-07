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


    switch (condition.operator) {
        case "EQUALS":
        case "==":
            return `{"${condition.field}": "${value}"}`;
        case "IN":
        case "in":
            return `{"${condition.field}": {"$in": ["${value}"]}}`;
        case "NOT_EQUALS":
        case "!=":
            return `{"${condition.field}": {"$ne": "${value}"}}`;
        case "GREATER_THAN":
        case ">":
            return `{"${condition.field}": {"$gt": "${value}"}}`;
        case "LESS_THAN":
        case "<":
            return `{"${condition.field}": {"$lt": "${value}"}}`;
        case "GREATER_THAN_OR_EQUAL":
        case ">=":
            return `{"${condition.field}": {"$gte": "${value}"}}`;
        case "LESS_THAN_OR_EQUAL":
        case "<=":
            return `{"${condition.field}": {"$lte": "${value}"}}`;
        case "BETWEEN":
            return `{"${condition.field}": {"$gte": "${lower}", "$lte": "${upper}"}}`;
        default:
            return `{"${condition.field}": "${value}"}`;
    }
}

async function getUserSegment(tree) {
    let querys = [];
    tree.conditions.forEach(conditionGroup => {
        let tempQuery = conditionGroup.map(condition => {
            return getQuery(condition);
        }).join(",");
        querys.push(`{"$and": [${tempQuery}]}`);
    });
    let query = `{"$or": [${querys.join(",")}]}`;
    let objectQuery = JSON.parse(query);
    let users = await User.find(objectQuery);
    let usersFilter = users.filter(user => {return user.user_communication_upsell_benefit == 'false'});
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