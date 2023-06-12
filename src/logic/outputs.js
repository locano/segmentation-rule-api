const Product = require("../models/catalogues/product");
const { getQuery } = require("./querys");

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
            let resultOut = await getOutputs(output, limit, userData)
            if (resultOut && resultOut.length > 0) {
                let dataOutput = resultOut.map(o => { return o._doc });
                results.push({ dataOutput, priority });
            }
        })
    );
    // order by priority
    results.sort((a, b) => (a.priority > b.priority) ? 1 : -1)
    // remove key priority
    results = results.map(r => { return r.dataOutput });

    // random results
    results = results.sort(() => Math.random() - 0.5);

    return results;
}

module.exports = { evaluateOutput, getOutputs }