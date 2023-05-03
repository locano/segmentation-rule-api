
function traverse(node) {
    const nodes = [node];
    (node.nodes || []).forEach((child_node) => {
        nodes.push(...traverse(child_node));
    });
    return nodes;
}

function extractConditions(obj, conditionsObj) {
    if (obj.conditions && obj.conditions.length > 0) {
      obj.conditions.forEach(conditionGroup => {
          conditionGroup.forEach(condition => {
            if (!conditionsObj[`${condition.fieldType}_${condition.field}`]) {
              conditionsObj[`${condition.fieldType}_${condition.field}`] = {
                fieldType: condition.fieldType,
                field: condition.field
              };
            }
          });
      });
    }
    if (obj.nodes && obj.nodes.length > 0) {
      obj.nodes.forEach(node => {
        extractConditions(node, conditionsObj);
      });
    }

    if (obj.outputs && obj.outputs.length > 0) {
      obj.outputs.forEach(output => {
        extractConditions(output, conditionsObj);
      });
    }

  }

function find_paths(node, current_path = [], paths = []) {
    current_path.push(node.description);
    if (!node.nodes || !node.nodes.length) {
        paths.push([...current_path]);
    } else {
        node.nodes.forEach((child_node) => {
            find_paths(child_node, current_path, paths);
        });
    }
    current_path.pop();
    return paths;
}

module.exports = { traverse, find_paths, extractConditions };