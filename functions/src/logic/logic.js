
function traverse(node, path) {
    // Check if the node's conditions are true
    let conditionsTrue = true;
    for (let condition of node.conditions) {
        if (!evaluateCondition(condition)) {
            conditionsTrue = false;
            break;
        }
    }

    // If the conditions are true, add the node to the path
    if (conditionsTrue) {
        path.push(node.description);

        // If this node is an output node, add the path to the list of paths
        if (node.output) {
            paths.push(path.slice());
        }
    }

    // Recursively traverse the child nodes
    for (let child of node.nodes) {
        traverse(child, path.slice());
    }
}

function getValue(condition) {
    // Implement your code to get the value for a condition based on the field and valueType properties
    // Here's an example implementation that just returns a hard-coded value for demonstration purposes:
    return "123";
}

function evaluateCondition(condition) {
    // Implement your code to evaluate a condition here
    // For example, you could use a switch statement to handle different operators and value types
    // and check if the condition is true based on the values provided in the condition object
    // Here's an example implementation that handles the '==' and 'in' operators and the 'STRING' and 'DATE' value types:
    switch (condition.operator) {
        case "==":
            return condition.value == getValue(condition);
        case "in":
            return getValue(condition).includes(condition.value);
        default:
            return false;
    }
}

function findMatchingPats(tree) {
    let paths = [];
    // Start traversing the tree from the root node
    traverse(tree.nodes[0], []);

    return paths;
}