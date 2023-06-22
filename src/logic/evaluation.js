const { evaluateConditions } = require("./conditions");
const { getMetrics } = require("./metrics");
const { evaluateOutput } = require("./outputs");
const { checkSettings } = require("./settings");
const AWS = require('aws-sdk');

var settings = []
var variables = []

async function evaluateSRE(tree, contextVariables = {}, filterUsers) {
    let results = [];
    settings = tree.settings;
    // No outputs
    let no_outputs = settings.find(element => element.key == "no_outputs");
    let treeMetrics = tree.metrics;
    variables = JSON.parse(contextVariables) || {};

    if (filterUsers.length > 0) {
        await Promise.all(
            filterUsers.map(async (userInfo, index) => {
                // Globbbal data/Context
                let userData = userInfo._doc;
                let result = await evaluateNodes(tree.nodes, userData);
                let user = userInfo.msisdn;
                let resultOutputs = result.outputs;
                let metrics = await getMetrics(treeMetrics, userData);
                if (resultOutputs.length > 0) {
                    let outputs = await checkSettings(resultOutputs, settings);
                    results.push({ user, outputs, metrics });
                } else {
                    if (no_outputs && no_outputs.value == true) {
                        let outputs = [];
                        results.push({ user, outputs, metrics });
                    }
                }

            })
        );
    }

    //suffle results
    results.sort(() => Math.random() - 0.5);

    let dataResult = await getResultData(results);

    return dataResult;
}

async function evaluateSRESF(tree, contextVariables = {}, filterUsers) {
    let results = [];
    settings = tree.settings;
    // No outputs
    let no_outputs = settings.find(element => element.key == "no_outputs");
    let treeMetrics = tree.metrics;
    variables = JSON.parse(contextVariables) || {};

    if (filterUsers.length > 0) {
        await Promise.all(
            filterUsers.map(async (userInfo, index) => {
                // Globbbal data/Context
                let userData = userInfo
                let result = await evaluateNodes(tree.nodes, userData);
                let user = userInfo.msisdn;
                let resultOutputs = result.outputs;
                let metrics = await getMetrics(treeMetrics, userData);
                if (resultOutputs.length > 0) {
                    let outputs = await checkSettings(resultOutputs, settings);
                    results.push({ user, outputs, metrics });
                } else {
                    if (no_outputs && no_outputs.value == true) {
                        let outputs = [];
                        results.push({ user, outputs, metrics });
                    }
                }

            })
        );
    }

    //suffle results
    results.sort(() => Math.random() - 0.5);

    let dataResult = await getResultData(results);

    return dataResult;
}

function getMegabitesSize(data) {
    const jsonString = JSON.stringify(data);
    const size = new TextEncoder().encode(jsonString).length
    const kiloBytes = size / 1024;
    const megaBytes = kiloBytes / 1024;
    return megaBytes;
}

async function getResultData(results) {
    const megaBytes = getMegabitesSize(results);

    try {
        var s3 = new AWS.S3();
        let filename = `result_${(new Date().toJSON())}.json`
        var params = {
            Bucket: "amplify-segmentationruleapi-dev-84649-deployment/evaluation-results",
            Key: filename,
            Body: JSON.stringify(results),
            Expires: 60 * 60
        }
        localParams = [params];
        await Promise.all(
            localParams.map(async (file) => {
                await s3.putObject(file, function (err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else console.log("Put to s3 should have worked: " + data);           // successful response
                }).promise()
            })
        );

        if (megaBytes > 4) {
            return {
                results: results.slice(0, 200),
                message: "Data size is greater than 4MB and has been saved in S3, you can see a preview in the results",
                stored: true,
                link: `https://amplify-segmentationruleapi-dev-84649-deployment/evaluation-results/${filename}`
            }
        } else {
            return {
                results: results,
                message: "Data size is less than 4MB you can see the results",
                stored: true,
                link: `https://amplify-segmentationruleapi-dev-84649-deployment/evaluation-results/${filename}`
            };
        }
    } catch (error) {
        return {
            results: [],
            message: error.message || "Error saving data in S3",
            stored: true
        };
    }



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




module.exports = { evaluateSRE, evaluateSRESF };