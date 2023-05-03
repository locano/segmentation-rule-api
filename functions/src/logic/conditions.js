// We will use this file to implement the logic for evaluating conditions
function evaluate_conditions(conditions, input) {
    for (const condition of conditions) {
        switch (condition.fieldType) {
            case "MODEL":
                if (input[condition.field] !== condition.value) {
                    return false;
                }
                break;
            case "CUSTOMER_PROFILE":
                if (input.customerProfile[condition.field] !== condition.value) {
                    return false;
                }
                break;
            // Add more cases for other fieldType values as needed
            default:
                console.error(`Unknown fieldType ${condition.fieldType}`);
                return false;
        }
    }
    return true;
}

// Recursive function to traverse the tree
function traverse(node, input) {
    const nodes = [node];
    if (evaluate_conditions(node.conditions, input)) {
        (node.nodes || []).forEach((child_node) => {
            nodes.push(...traverse(child_node, input));
        });
    }
    return nodes;
}

const all_nodes_matching_conditions = traverse(tree, input);