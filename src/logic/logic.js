const { evaluateConditions } = require("./conditions");
const { getUserSegment, getOutputs } = require("./segments");


var userData = {}
var settings = []
var metrics = []
var variables = []

async function evaluateSRE(tree, contextVariables = []) {
    let results = [];
    let filterUsers = await getUserSegment(tree);
    settings = tree.settings;
    metrics = tree.metrics;
    variables = contextVariables || {};

    if (filterUsers.length > 0) {
        // await Promise.all(
        // filterUsers.map(async (userInfo, index) => {
        //     // Globbbal data/Context
        //     userData = userInfo.data;
        //     let result = await evaluateNodes(tree.nodes);
        //     let user = userInfo.msidn;
        //     let outputs = result.outputs;
        //     if (outputs.length > 0) {
        //         let metrics = await getMetrics();
        //         // let outputSettings = await checkSettings(outputs);
        //         results.push({ user, outputs, metrics });
        //     }

        // })

        userData = filterUsers[0].data;
        let result = await evaluateNodes(tree.nodes);
        let user = filterUsers[0].msidn;
        let outputs = result.outputs;
        if (outputs.length > 0) {
            let metrics = await getMetrics();
            // let outputSettings = await checkSettings(outputs);
            results.push({ user, outputs, metrics });
        }
        // );
    }

    return results;
}

async function evaluateNodes(nodes, exclusive = false) {
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
                let outputResult = await evaluateOutput(node.outputs);
                nodeResult.outputs = [...nodeResult.outputs, ...outputResult];
            }
            if (node.nodes && node.nodes.length > 0) {
                let childResult = await evaluateNodes(node.nodes, node.exclusive);
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

async function evaluateOutput(outputs) {
    let results = [];

    if (outputs.length == 0) {
        return results;
    }

    await Promise.all(
        outputs.map(async output => {
            let resultOut = await getOutputs(output)
            if (resultOut && resultOut.length > 0) {
                results.push(resultOut);
            }
        })
    );


    return results;
}

async function getMetrics() {
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

async function checkSettings() {
    let s = [
        {
            key: "campaigns_per_user",
            value: 1,
        }
    ];


}

module.exports = { evaluateSRE };