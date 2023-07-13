import math
from decimal import *
variables = []

def get_correct_value_type(value, value_type):
    if value_type == 'BOOLEAN':
        if value == 'true' or value == True:
            return True
        else:
            return False
    elif value_type == 'NUMBER':
        if value == None or value == '' or value == 'undefined':
            value = 0
        return Decimal(value)
    elif value_type == 'DATE':
        return datetime.strptime(value, '%Y-%m-%dT%H:%M:%S.%fZ')
    else:
        return str(value)

def get_value(field_type, field, value_type, user_data = {}):
    if field_type == 'CUSTOMER_PROFILE':
        return get_correct_value_type(user_data[field], value_type)
    elif field_type == 'CONTEXT_VARIABLE':
        return get_correct_value_type(variables[field], value_type)
    else:
        return get_correct_value_type(field, value_type)

def evaluate(condition, user_data = {}):
    condition_value = 0
    upper = 0
    lower = 0
    value = get_value(condition['fieldType'], condition['field'], condition['valueType'], user_data)

    if condition['operator'] == 'BETWEEN':
        values = condition['value'].split(',')
        upper = get_correct_value_type(values[1], condition['valueType'])
        lower = get_correct_value_type(values[0], condition['valueType'])
    else:
        condition_value = get_value(condition['source'], condition['value'], condition['valueType'], user_data)

    operator = condition['operator']
    if operator == 'EQUALS' or operator == '==':
        return condition_value == value
    elif operator == 'IN' or operator == 'in':
        return value in condition_value
    elif operator == 'NOT_EQUALS' or operator == '!=':
        return condition_value != value
    elif operator == 'GREATER_THAN' or operator == '>':
        return value > condition_value
    elif operator == 'LESS_THAN' or operator == '<':
        return value < condition_value
    elif operator == 'GREATER_THAN_OR_EQUAL' or operator == '>=':
        return value >= condition_value
    elif operator == 'LESS_THAN_OR_EQUAL' or operator == '<=':
        return value <= condition_value
    elif operator == 'BETWEEN':
        return lower <= value <= upper
    else:
        return False

def evaluate_conditions(condition_groups, user_data, _variables):
    global variables
    variables = _variables

    print(condition_groups)
    print(len(condition_groups))
    if len(condition_groups) == 0:
        return True

    conditions_true = False
    results_groups = []

    for condition_group in condition_groups:
        group_true = True
        for condition in condition_group:
            evaluated = evaluate(condition, user_data)
            if not evaluated:
                group_true = False
                break
        results_groups.append(group_true)

    for result in results_groups:
        if result:
            conditions_true = True
            break

    return conditions_true
