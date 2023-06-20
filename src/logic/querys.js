const { getValue } = require("./conditions");

function getQuery(condition, userData = {}) {
    let upper = 0;
    let lower = 0;
    let value = '';
    if (condition.operator == 'BETWEEN') {
        let values = condition.value.split(',');
        upper = getCorrectValueType(values[1], condition.valueType);
        lower = getCorrectValueType(values[0], condition.valueType);
    } else {
        value = getValue(condition.source, condition.value, condition.valueType, userData);
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

function getQueryDynamo(condition, userData = {}) {
    let upper = 0;
    let lower = 0;
    let value = '';
    if (condition.operator == 'BETWEEN') {
        let values = condition.value.split(',');
        upper = getCorrectValueType(values[1], condition.valueType);
        lower = getCorrectValueType(values[0], condition.valueType);
    } else {
        value = getValue(condition.source, condition.value, condition.valueType, userData);
    }

    if (condition.valueType == "BOOLEAN") {
        value = value == true ? "true" : "false";
    }

    let queryValue = condition.valueType == "STRING" ? `${value}` : value;


    switch (condition.operator) {
        case "BETWEEN":
            return `${lower} AND ${upper}`;
        default:
            return queryValue;
    }
}

function getOperatorDynamo(operator) {
    switch (operator) {
        case "EQUALS":
        case "==":
            return `=`;
        case "NOT_EQUALS":
        case "!=":
            return `<>`;
        case "GREATER_THAN":
        case ">":
            return `>`;
        case "LESS_THAN":
        case "<":
            return `<`;
        case "GREATER_THAN_OR_EQUAL":
        case ">=":
            return `>=`;
        case "LESS_THAN_OR_EQUAL":
        case "<=":
            return `<=`;
        case "BETWEEN":
            return `BETWEEN`;
        default:
            return `=`;
    }
}

module.exports = { getQuery, getQueryDynamo ,getOperatorDynamo}