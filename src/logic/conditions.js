var userData = {}
var settings = []
var metrics = []
var variables = []


function getCorrectValueType(value, valueType) {
    switch (valueType) {
        case 'BOOLEAN':
            return Boolean(value);
        case 'NUMBER':
            return Number(value);
        case 'DATE':
            return new Date(value);
        default:
            return value.toString();
    }

}

function getValue(fieldType, field, valueType) {
    switch (fieldType) {
        case 'CUSTOMER_PROFILE':
            return getCorrectValueType(userData[field], valueType);
        case 'CONTEXT_VARIABLE':
            return getCorrectValueType(variables[field], valueType);
        default:
            return getCorrectValueType(field, valueType);
    }
}

function evaluate(condition) {
    let conditionValue = 0;
    let upper = 0;
    let lower = 0;
    // Value from fieldType
    let value = getValue(condition.fieldType, condition.field, condition.valueType);

    // Value from Condition
    if (condition.operator == 'BETWEEN') {
        let values = condition.value.split(',');
        upper = getCorrectValueType(values[1], condition.valueType);
        lower = getCorrectValueType(values[0], condition.valueType);
    } else {
        conditionValue = getValue(condition.source, condition.value, condition.valueType);
    }

    switch (condition.operator) {
        case "EQUALS":
        case "==":
            return conditionValue == value;
        case "IN":
        case "in":
            return value.includes(conditionValue);
        case "NOT_EQUALS":
        case "!=":
            return conditionValue != value;
        case "GREATER_THAN":
        case ">":
            return value > conditionValue;
        case "LESS_THAN":
        case "<":
            return value < conditionValue;
        case "GREATER_THAN_OR_EQUAL":
        case ">=":
            return value >= conditionValue;
        case "LESS_THAN_OR_EQUAL":
        case "<=":
            return value <= conditionValue;
        case "BETWEEN":
            return value >= lower && value <= upper;
        default:
            return false;
    }
}

function evaluateConditions(conditionGroups, _userData, _variables) {
    userData = _userData;
    variables = _variables;

    let conditionsTrue = false;
    let resultsGroups = []

    if (conditionGroups && conditionGroups.length == 0) {
        return true;
    }

    conditionGroups.forEach(conditionGroup => {
        let groupTrue = true;
        conditionGroup.forEach(condition => {
            let evaluated = evaluate(condition);
            if (!evaluated) {
                groupTrue = false;
                return;
            }
        });
        resultsGroups.push(groupTrue);
    });

    resultsGroups.forEach(result => {
        if (result) {
            conditionsTrue = true;
            return conditionsTrue;
        }
    });


    return conditionsTrue;
}

module.exports = { evaluateConditions, getValue, getCorrectValueType }