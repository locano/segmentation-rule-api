from conditions import *
from metrics import *
from outputs import *
from settings import *
from results import *
import random
def evaluate_sresf(tree, context_variables={}, filter_users=[]):
    print("start evaluation")
    results = []
    settings = tree['settings']
    no_outputs = next((element for element in settings if element['key'] == 'no_outputs'), None)
    tree_metrics = tree['metrics']
    variables = json.loads(context_variables) if context_variables else {}
    data_result = []
    if filter_users:
        print(len(filter_users))
        for index, user_info in enumerate(filter_users):
            user_data = user_info
            result = evaluate_nodes(tree['nodes'], user_data)
            user = user_info['msisdn']
            result_outputs = result['outputs']
            metrics = get_metrics(tree_metrics, user_data)

            if result_outputs:
                outputs = check_settings(result_outputs, settings)
                results.append({'user': user, 'outputs': outputs, 'metrics': metrics})
            elif no_outputs and no_outputs['value']:
                outputs = []
                results.append({'user': user, 'outputs': outputs, 'metrics': metrics})

        random.shuffle(results)
        data_result = get_result_data(results, "test1")

    return data_result

def evaluate_nodes(nodes, user_data, exclusive=False):
    results = {'paths': [], 'outputs': []}

    if not nodes:
        return results

    for node in nodes:
        if not node['enable']:
            continue

        node_result = {'paths': [], 'outputs': []}

        if evaluate_conditions(node['conditions'], user_data, variables):
            node_result['paths'].append(node['description'])

            if node['output']:
                output_result = evaluate_output(node['outputs'], user_data)
                node_result['outputs'].extend(output_result)

            if node['nodes'] and len(node['nodes']) > 0:
                child_result = evaluate_nodes(node['nodes'], user_data, node['exclusive'])
                node_result['paths'].extend(child_result['paths'])
                node_result['outputs'].extend(child_result['outputs'])

            results['paths'].append(node_result['paths'])
            results['outputs'].extend(node_result['outputs'])

            if exclusive:
                break

    return results
