const { evaluateConditions } = require("./conditions");
const { getMetrics } = require("./metrics");
const { evaluateOutput } = require("./outputs");
const { checkSettings } = require("./settings");


var settings = []
var variables = []

async function evaluateSRE(tree, contextVariables = {}, filterUsers) {
    let results = [];
    settings = tree.settings;
    let treeMetrics = tree.metrics;
    variables = JSON.parse(contextVariables) || {};

    if (filterUsers.length > 0) {
        await Promise.all(
            filterUsers.map(async (userInfo, index) => {
                // Globbbal data/Context
                let userData = userInfo._doc
                let result = await evaluateNodes(tree.nodes, userData);
                let user = userInfo.msisdn;
                let resultOutputs = result.outputs;
                let metrics = await getMetrics(treeMetrics, userData);
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




module.exports = { evaluateSRE };