const { evaluateConditions } = require("./conditions");
const { getUserSegment } = require("./segments");

async function startSRE(tree) {
    let results = {
        paths: [],
        outputs: [],
        userEvaluated: []
    }
    let filterUsers = await getUserSegment(tree);
    if (filterUsers.length > 0) {
        // await Promise.all(
        // filterUsers.map(async (user, index) => {
        //     let userData = user.data;
        //     let result = evaluateNode(tree, userData);
        //     result.path = ['root', ...result.path]
        //     results.outputs.push(result);
        // })
        let userData = filterUsers[0].data;
        let result = evaluateNode(tree, userData);
        results.paths = ['root', ...result.paths]
        results.outputs = result.outputs;
        // );
        results.userEvaluated = filterUsers.map(user => user.msidn);
    }

    return results;
}

function evaluateNode(tree, userData) {
    let results = {
        paths: [],
        outputs: []
    }

    if (tree && tree.nodes && tree.nodes.length == 0) {
        return results;
    }

    for (let node of tree.nodes) {
        let nodeResult = {
            paths: [],
            outputs: [],
        }
        if (evaluateConditions(node.conditions, userData)) {
            nodeResult.paths.push(node.description);
            if (node.output) {
                nodeResult.outputs = [...nodeResult.outputs, ...evaluateOutput(node.outputs, userData)];
            }
            if (node.nodes.length > 0) {
                let childResult = evaluateNode(node, userData);
                nodeResult.paths = [...nodeResult.paths, ...childResult.paths];
                nodeResult.outputs = [...nodeResult.outputs, ...childResult.outputs];
            }
            results.paths.push(nodeResult.paths);
            results.outputs = [...results.outputs, ...nodeResult.outputs];
        }
    }

    return results;
}

function evaluateOutput(outputs, userData) {
    let results = [];

    if (outputs.length == 0) {
        return results;
    }


    outputs.forEach(output => {
        if (evaluateConditions(output.conditions, userData)) {
            results.push(output.description);
        }
    });

    return results;
}

module.exports = { startSRE };