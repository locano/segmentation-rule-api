const operators = [
    {
        "key": "EQUALS",
        "value": "==",
    },
    {
        "key": "NOT_EQUALS",
        "value": "!=",
    },
    {
        "key": "GREATER_THAN",
        "value": ">",
    },
    {
        "key": "LESS_THAN",
        "value": "<",
    },
    {
        "key": "GREATER_THAN_OR_EQUAL",
        "value": ">=",
    },
    {
        "key": "LESS_THAN_OR_EQUAL",
        "value": "<=",
    }
]

const valueTypes = [
    {
        "key": "STRING",
        "value": "String",
    },
    {
        "key": "NUMBER",
        "value": "Number",
    },
    {
        "key": "BOOLEAN",
        "value": "Boolean",
    },
    {
        "key": "DATE",
        "value": "Date",
    },
    {
        "key": "DATETIME",
        "value": "DateTime",
    }]

const fieldTypes = [
    {
        "key": "CUSTOMER_PROFILE",
        "value": "Customer Profile",
    },
    {
        "key": "MODEL",
        "value": "Model",
    }, {
        "key": "CONTEXT_VARIABLE",
        "value": "Context Variable",
    },
    {
        "key": "CUSTOM_VARIABLE",
        "value": "Custom Variable",
    }]

module.exports = { operators, valueTypes, fieldTypes };