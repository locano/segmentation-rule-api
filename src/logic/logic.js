const { evaluateConditions } = require("./conditions");
const { getUserSegment, getOutputs } = require("./segments");


var settings = []
var metrics = []
var variables = []

async function evaluateSRE(tree, contextVariables = {}, limitUsers = null, testUser = null) {
    let results = [];
    let filterUsers = await getUserSegment(tree, limitUsers, testUser);
    settings = tree.settings;
    metrics = tree.metrics;
    variables = JSON.parse(contextVariables) || {};

    if (filterUsers.length > 0) {
        await Promise.all(
            filterUsers.map(async (userInfo, index) => {
                // Globbbal data/Context
                let userData = userInfo._doc
                let result = await evaluateNodes(tree.nodes, userData);
                let user = userInfo.msisdn;
                let resultOutputs = result.outputs;
                let metrics = await getMetrics(userData);
                if (resultOutputs.length > 0) {
                    let outputs = await checkSettings(resultOutputs, settings);
                    results.push({ user, outputs, metrics });
                } else {
                    let outputs = [];
                    results.push({ user, outputs, metrics });
                }

            })
        );
    }

    return results;
}

async function evaluateNodes(nodes, userData, exclusive = false) {
    let results = {
        paths: [],
        outputs: []
    }

    if (nodes && nodes.length == 0) {
        return results;
    }

    for (let node of nodes) {
        // Skip disabled nodes
        if (node.enable == false) { continue; }

        // Evaluate node
        let nodeResult = {
            paths: [],
            outputs: [],
        }
        if (evaluateConditions(node.conditions, userData, variables)) {
            nodeResult.paths.push(node.description);

            if (node.output) {
                let outputResult = await evaluateOutput(node.outputs, userData);
                nodeResult.outputs = [...nodeResult.outputs, ...outputResult];
            }
            if (node.nodes && node.nodes.length > 0) {
                let childResult = await evaluateNodes(node.nodes, userData, node.exclusive);
                nodeResult.paths = [...nodeResult.paths, ...childResult.paths];
                nodeResult.outputs = [...nodeResult.outputs, ...childResult.outputs];
            }

            results.paths.push(nodeResult.paths);
            results.outputs = [...results.outputs, ...nodeResult.outputs];

            if (exclusive) {
                break;
            }
        }
    }

    return results;
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
            let resultOut = await getOutputs(output, limit)
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

    return results;
}

async function getMetrics(userData) {
    let m = [];

    if (!metrics || metrics.length == 0) {
        return m;
    }

    await Promise.all(
        metrics.map(async metric => {
            let data = {};
            data[metric.key] = userData[metric.key];
            m.push(data);
        })
    );

    return m;
}

async function checkSettings(outputs, settings) {

    if (!settings || settings.length == 0) {
        return outputs[0];
    }

    settings.forEach(element => {
        switch (element.key) {
            case "campaigns_per_user":
                outputs = outputs.slice(0, element.value);
                break;
        }
    });

    return outputs[0];

}

module.exports = { evaluateSRE };