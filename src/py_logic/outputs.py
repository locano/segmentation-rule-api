def build_expression_attribute_values(conditions, user_data):
    attribute_values = {}

    for condition in conditions:
        for sub_condition in condition:
            field = sub_condition['field']
            query_value = get_query_dynamo(sub_condition, user_data)
            expression_value = f':{field.replace(".", "_")}'
            attribute_values[expression_value] = query_value

    return attribute_values

def build_filter_expression(conditions):
    expressions = []

    for condition in conditions:
        sub_expressions = []

        for sub_condition in condition:
            field = sub_condition['field']
            operator = sub_condition['operator']
            expression_key = f'#{field.replace(".", "_")}'
            expression_value = f':{field.replace(".", "_")}'
            sub_expressions.append(f'{expression_key} {get_operator_dynamo(operator)} {expression_value}')

        expressions.append(f'({" AND ".join(sub_expressions)})')

    return ' OR '.join(expressions)

def build_expression_attribute_names(conditions):
    attribute_names = {}

    for condition in conditions:
        for sub_condition in condition:
            field = sub_condition['field']
            expression_key = f'#{field.replace(".", "_")}'
            attribute_names[expression_key] = field

    return attribute_names

async def get_products(table_name, product_type, conditions, limit_outputs, user_data):
    dynamodb = boto3.client('dynamodb', region_name='us-east-1')

    exp1 = build_filter_expression(conditions)
    exp2 = build_expression_attribute_values(conditions, user_data)
    exp3 = build_expression_attribute_names(conditions)

    exp1 = f"#type = :type AND {exp1}"
    exp2[':type'] = product_type
    exp3['#type'] = 'type'

    params = {
        'TableName': table_name,
        'FilterExpression': exp1,
        'ExpressionAttributeValues': exp2,
        'ExpressionAttributeNames': exp3
    }

    try:
        response = await dynamodb.scan(**params)
        return response['Items']
    except Exception as err:
        return {'error': str(err), 'products': []}

async def evaluate_output(outputs, user_data):
    results = []

    if len(outputs) == 0:
        return results

    for output in outputs:
        limit = output['limit']
        priority = output['priority']
        result_out = await get_products('srProductCatalogue', output['catalogue'], output['conditions'], limit, user_data)
        if result_out and len(result_out) > 0:
            results.append({'resultOut': result_out, 'priority': priority})

    results.sort(key=lambda x: x['priority'])
    results = [r['resultOut'] for r in results]
    random.shuffle(results)

    return results
