const { evaluateConditions } = require("./conditions");
const { getUserSegment } = require("./segments");

async function startSRE(tree) {
    let results = {
        outputs: [],
        userEvaluated: []
    }
    let filterUsers = await getUserSegment(tree);
    if (filterUsers.length > 0) {
        await Promise.all(
            filterUsers.map(async (user, index) => {
                let userData = user.data;
                let result = evaluateNode(tree, userData);
                result.path = ['root', ...result.path]
                results.outputs.push(result);
            })
        );
        results.userEvaluated = filterUsers.map(user => user.msidn);
    }

    return results;
}

function evaluateNode(tree) {
    let results = {
        path: [tree.description],
        outputs: [],
        apply: false
    }

    if (tree && tree.nodes && tree.nodes.length == 0) {
        return results;
    }

    for (let node of tree.nodes) {
        if (evaluateConditions(node.conditions)) {
            results.path.push(node.description);
            if (node.output) {
                results.outputs = [...results.outputs, ...evaluateOutput(node.outputs)];
            }
            if (node.nodes.length > 0) {
                let childResult = evaluateNode(node);
                results.path = [...results.path, ...childResult.path];
                results.outputs = [...results.outputs, ...childResult.outputs];
            }
        }
    }

    return results;
}

function evaluateOutput(outputs) {
    let results = [];

    if (outputs.length == 0) {
        return results;
    }


    outputs.forEach(output => {
        if (evaluateConditions(output.conditions)) {
            results.push(output);
        }
    });

    return results;
}

module.exports = { startSRE };