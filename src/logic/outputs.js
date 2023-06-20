const Product = require("../models/catalogues/product");
const { getQuery, getQueryDynamo, getOperatorDynamo } = require("./querys");
const AWS = require('aws-sdk');

function buildExpressionAttributeValues(conditions, userData) {
    const attributeValues = {};

    conditions.forEach(condition => {
        condition.forEach(subCondition => {
            const { field } = subCondition;
            const queryValue = getQueryDynamo(subCondition, userData);
            const expressionValue = `:${field.replace('.', '_')}`;
            attributeValues[expressionValue] = queryValue;
        });
    });
    return attributeValues;
}

function buildFilterExpression(conditions) {
    const expressions = conditions.map(condition => {

        const subExpressions = condition.map(subCondition => {
            const { field, operator } = subCondition;
            const expressionKey = `#${field.replace('.', '_')}`;
            const expressionValue = `:${field.replace('.', '_')}`;

            return `${expressionKey} ${getOperatorDynamo(operator)} ${expressionValue}`;
        });
        return `(${subExpressions.join(' AND ')})`;
    });

    return expressions.join(' OR ');
}

function buildExpressionAttributeNames(conditions) {

    const attributeNames = {};

    conditions.forEach(condition => {
        condition.forEach(subCondition => {
            const { field } = subCondition;
            const expressionKey = `#${field.replace('.', '_')}`;
            attributeNames[expressionKey] = field;
        });
    });
    return attributeNames;
}

async function getProducts(tableName, productType, conditions, limitOutputs, userData) {
    const docClient = new AWS.DynamoDB.DocumentClient(
        { region: 'us-east-1' }
    );

    let exp1 = buildFilterExpression(conditions, userData);
    let exp2 = buildExpressionAttributeValues(conditions);
    let exp3 = buildExpressionAttributeNames(conditions);

    exp1 = exp1 + " AND #type = :type"
    exp2[":type"] = productType
    exp3["#type"] = "type"


    const params = {
        TableName: tableName,
        FilterExpression: exp1,
        ExpressionAttributeValues: exp2,
        ExpressionAttributeNames: exp3
    };
    try {
        const data = await docClient.scan(params).promise()
        return data.Items
    } catch (err) {
        return { error: err, products: [] }
    }
}

async function getOutputs(node, limitOutputs, userData) {
    let querys = [];
    let query = '{}';
    let sortQuerys = [];
    let sortQuery = '{}';
    node.conditions.forEach(conditionGroup => {
        let tempQuery = conditionGroup.map(condition => {
            return getQuery(condition, userData);
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
    if (limitOutputs && limitOutputs > 0) {
        let products = await Product.find(objectQuery).limit(limitOutputs).sort(sortObjectQuery);
        return products;
    }

    let products = await Product.find(objectQuery).sort(sortObjectQuery);
    // Random products
    products = products.sort(() => Math.random() - 0.5);
    return products;
}

async function evaluateOutput(outputs, userData) {
    let results = [];

    if (outputs.length == 0) {
        return results;
    }

    await Promise.all(
        outputs.map(async output => {
            let limit = output.limit;
            let priority = output.priority;
            // let resultOut = await getOutputs(output, limit, userData)
            let resultOut = await getProducts('srProductCatalogue', output.catalogue, output.conditions, limit, userData)
            if (resultOut && resultOut.length > 0) {
                // let dataOutput = resultOut.map(o => { return o._doc });
                results.push({ resultOut, priority });
            }
        })
    );
    // order by priority
    results.sort((a, b) => (a.priority > b.priority) ? 1 : -1)
    // remove key priority
    results = results.map(r => { return r.resultOut });

    // random results
    results = results.sort(() => Math.random() - 0.5);

    return results;
}

module.exports = { evaluateOutput, getOutputs, getProducts }