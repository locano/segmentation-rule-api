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

function getValue(condition, userData) {
    switch (condition.fieldType) {
        case 'CUSTOMER_PROFILE':
            return getCorrectValueType(userData[condition.field], condition.valueType);
        default:
            return '1223';
    }
}

function evaluate(condition, userData) {
    let value = getValue(condition, userData);
    let conditionValue = getCorrectValueType(condition.value, condition.valueType);

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
        case ">=":
            return value <= conditionValue;
        default:
            return false;
    }
}

function evaluateConditions(conditionGroups, userData) {
    let conditionsTrue = false;
    let resultsGroups = []

    if (conditionGroups && conditionGroups.length == 0) {
        return false;
    }

    conditionGroups.forEach(conditionGroup => {
        let groupTrue = true;
        conditionGroup.forEach(condition => {
            let evaluated = evaluate(condition, userData);
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

module.exports = { evaluateConditions }