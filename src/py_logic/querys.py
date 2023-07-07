def get_query_dynamo(condition, user_data={}):
    upper = 0
    lower = 0
    value = ''
    if condition['operator'] == 'BETWEEN':
        values = condition['value'].split(',')
        upper = get_correct_value_type(values[1], condition['valueType'])
        lower = get_correct_value_type(values[0], condition['valueType'])
    else:
        value = get_value(condition['source'], condition['value'], condition['valueType'], user_data)

    if condition['valueType'] == "BOOLEAN":
        value = "true" if value else "false"

    query_value = str(value) if condition['valueType'] == "STRING" else value

    operator = condition['operator']

    if operator == "BETWEEN":
        return f"{lower} AND {upper}"
    else:
        return query_value

def get_operator_dynamo(operator):
    if operator in ["EQUALS", "=="]:
        return "="
    elif operator in ["NOT_EQUALS", "!="]:
        return "<>"
    elif operator in ["GREATER_THAN", ">"]:
        return ">"
    elif operator in ["LESS_THAN", "<"]:
        return "<"
    elif operator in ["GREATER_THAN_OR_EQUAL", ">="]:
        return ">="
    elif operator in ["LESS_THAN_OR_EQUAL", "<="]:
        return "<="
    elif operator == "BETWEEN":
        return "BETWEEN"
    else:
        return "="
