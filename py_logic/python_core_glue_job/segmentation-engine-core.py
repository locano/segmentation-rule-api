import sys
import json
import boto3
from boto3.dynamodb.types import TypeDeserializer
import random
import csv
import time
from decimal import *
from awsglue.utils import getResolvedOptions

serializer = boto3.dynamodb.types.TypeSerializer()
client_dynamodb = boto3.client("dynamodb")
glue_client = boto3.client("glue")

variables_conditions = []
args = getResolvedOptions(sys.argv, ["id_rule", "variables", "path"])
print("args", args)

response = glue_client.get_job_runs(JobName="segmentation-engine-core")
job_run_id = response["JobRuns"][0]["Id"]
print("job_run_id", job_run_id)

# GET USERS FROM BUCKET
def get_user_from_bucket(path):
    try:
        if path is None:
            return []

        s3_client = boto3.client("s3")

        data = path.split("//")
        bucket = data[1].split("/")[0]
        key = path.split(bucket + "/")[1]

        # Get the file inside the S3 Bucket
        s3_response = s3_client.get_object(Bucket=bucket, Key=key)
        # Get the Body object in the S3 get_object() response
        s3_object_body = s3_response.get("Body")
        read = csv.DictReader(s3_object_body.read().decode("utf-8").splitlines())
        users = list(read)

        return users
    except Exception as e:
        print(e)
        return []


# RESULTS
def get_megabytes_size(data):
    json_string = json.dumps(data)
    size = len(json_string.encode())
    kilo_bytes = size / 1024
    mega_bytes = kilo_bytes / 1024

    return mega_bytes


def saveResults(
    name, filename, bucket, key, total_users, output_users, no_output_users, preview
):
    try:
        params = {
            "id_rule": {"S": name},
            "id_evaluation": {"S": job_run_id},
            "bucket": {"S": bucket},
            "key": {"S": key},
            "total_users": {"N": total_users},
            "output_users": {"N": output_users},
            "no_output_users": {"N": no_output_users},
            "preview": {"S": preview},
        }
        responseItem = client_dynamodb.put_item(
            TableName="segmentation-engine-config-rule-evalutation",
            Item=params,
        )
        print("params", params)
        return responseItem
    except Exception as e:
        print(e)


def get_result_data(results, name):
    mega_bytes = get_megabytes_size(results)

    try:
        s3 = boto3.client("s3")
        filename = f"{name.replace(' ', '_')}_{int(time.time())}.json"
        data_dump = json.dumps(results)
        bucket = "segmentation-engine-evaluation-results"
        key = f"{name}/{filename}"
        params = {
            "Bucket": bucket,
            "Key": key,
            "Body": data_dump,
        }
        result = s3.put_object(**params)

        res = result.get("ResponseMetadata")
        print("s3 result", res)

        if res.get("HTTPStatusCode") == 200:
            print("File Uploaded Successfully")
            total_users = len(results)
            output_users = len(
                list(filter(lambda item: len(item["outputs"]) > 0, results))
            )
            no_output_users = len(
                list(filter(lambda item: len(item["outputs"]) == 0, results))
            )

            preview = []

            if mega_bytes > 1:
                preview = json.dumps(results[:200])
            else:
                preview = json.dumps(results)

            saveResults(
                name,
                filename,
                bucket,
                key,
                total_users,
                output_users,
                no_output_users,
                preview,
            )
            print(
                "Data stored in DynamoDB, table: segmentation-engine-config-rule-evalutation"
            )
            print("Bucket: ", bucket)
            print("Key: ", key)
            return {
                "message": "Data stored in S3",
                "stored": True,
                "bucket": bucket,
                "key": key,
            }
        else:
            print("File Not Uploaded")
            return {"message": "Data not stored", "stored": False}

    except Exception as e:
        print("error s3", e)
        return {
            "results": [],
            "message": str(e) or "Error saving data in S3",
            "stored": True,
        }


# EVALUATION
def evaluate_sresf(tree, context_variables={}, filter_users=[]):
    print("hola")
    results = []
    settings = tree["settings"]
    no_outputs = next(
        (element for element in settings if element["key"] == "no_outputs"), None
    )
    tree_metrics = tree["metrics"]
    start_variables = json.loads(context_variables) if context_variables else {}
    data_result = []
    print("total users:", len(filter_users))
    if filter_users:
        for index, user_info in enumerate(filter_users):
            user_data = user_info
            result = evaluate_nodes(tree["nodes"], user_data, start_variables)
            user = user_info["msisdn"]
            result_outputs = result["outputs"]
            metrics = get_metrics(tree_metrics, user_data)

            if result_outputs:
                outputs = check_settings(result_outputs, settings)
                results.append({"user": user, "outputs": outputs, "metrics": metrics})
            elif no_outputs and no_outputs["value"]:
                outputs = []
                results.append({"user": user, "outputs": outputs, "metrics": metrics})

        random.shuffle(results)
        print("data results")
        data_result = get_result_data(results, tree["name"])

    return data_result


def evaluate_nodes(nodes, user_data, start_variables, exclusive=False):
    results = {"paths": [], "outputs": []}

    if not nodes:
        return results

    for node in nodes:
        if not node["enable"]:
            continue

        node_result = {"paths": [], "outputs": []}

        if evaluate_conditions(node["conditions"], user_data, start_variables):
            node_result["paths"].append(node["description"])

            if node["output"]:
                output_result = evaluate_output(node["outputs"], user_data)
                node_result["outputs"].extend(output_result)

            if node["nodes"] and len(node["nodes"]) > 0:
                child_result = evaluate_nodes(
                    node["nodes"], user_data, start_variables, node["exclusive"]
                )
                node_result["paths"].extend(child_result["paths"])
                node_result["outputs"].extend(child_result["outputs"])

            results["paths"].append(node_result["paths"])
            results["outputs"].extend(node_result["outputs"])

            if exclusive:
                break

    return results


# CONDITIONS


def get_correct_value_type(value, value_type):
    if value_type == "BOOLEAN":
        if value == "true" or value == True:
            return True
        else:
            return False
    elif value_type == "NUMBER":
        if value == None or value == "" or value == "undefined":
            value = 0
        return Decimal(value)
    elif value_type == "DATE":
        return datetime.strptime(value, "%Y-%m-%dT%H:%M:%S.%fZ")
    else:
        return str(value)


def get_value(field_type, field, value_type, user_data={}):
    if field_type == "CUSTOMER_PROFILE":
        return get_correct_value_type(user_data[field], value_type)
    elif field_type == "CONTEXT_VARIABLE":
        return get_correct_value_type(variables_conditions[field], value_type)
    else:
        return get_correct_value_type(field, value_type)


def evaluate(condition, user_data={}):
    condition_value = 0
    upper = 0
    lower = 0
    value = get_value(
        condition["fieldType"], condition["field"], condition["valueType"], user_data
    )

    if condition["operator"] == "BETWEEN":
        values = condition["value"].split(",")
        upper = get_correct_value_type(values[1], condition["valueType"])
        lower = get_correct_value_type(values[0], condition["valueType"])
    else:
        condition_value = get_value(
            condition["source"], condition["value"], condition["valueType"], user_data
        )

    operator = condition["operator"]
    if operator == "EQUALS" or operator == "==":
        return condition_value == value
    elif operator == "IN" or operator == "in":
        return value in condition_value
    elif operator == "NOT_EQUALS" or operator == "!=":
        return condition_value != value
    elif operator == "GREATER_THAN" or operator == ">":
        return value > condition_value
    elif operator == "LESS_THAN" or operator == "<":
        return value < condition_value
    elif operator == "GREATER_THAN_OR_EQUAL" or operator == ">=":
        return value >= condition_value
    elif operator == "LESS_THAN_OR_EQUAL" or operator == "<=":
        return value <= condition_value
    elif operator == "BETWEEN":
        return lower <= value <= upper
    else:
        return False


def evaluate_conditions(condition_groups, user_data, _variables):
    global variables_conditions
    variables_conditions = _variables

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


# OPERATOR
def get_query_dynamo(condition, user_data={}):
    upper = 0
    lower = 0
    value = ""
    if condition["operator"] == "BETWEEN":
        values = condition["value"].split(",")
        upper = get_correct_value_type(values[1], condition["valueType"])
        lower = get_correct_value_type(values[0], condition["valueType"])
    else:
        value = get_value(
            condition["source"], condition["value"], condition["valueType"], user_data
        )

    if condition["valueType"] == "BOOLEAN":
        value = "true" if value else "false"

    query_value = str(value) if condition["valueType"] == "STRING" else value

    operator = condition["operator"]

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


# OUTPUTS
def get_query_dynamo(condition, user_data={}):
    upper = 0
    lower = 0
    value = ""
    if condition["operator"] == "BETWEEN":
        values = condition["value"].split(",")
        upper = get_correct_value_type(values[1], condition["valueType"])
        lower = get_correct_value_type(values[0], condition["valueType"])
    else:
        value = get_value(
            condition["source"], condition["value"], condition["valueType"], user_data
        )

    if condition["valueType"] == "BOOLEAN":
        value = "true" if value else "false"

    query_value = str(value) if condition["valueType"] == "STRING" else value

    operator = condition["operator"]

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


# SETTINGS
def check_settings(outputs, settings):
    if not settings or len(settings) == 0:
        return outputs[0]

    filter_outputs = outputs[0]

    for element in settings:
        if element["key"] == "outputs_per_user":
            filter_outputs = outputs[0][: element["value"]]
            break

    return filter_outputs


# Metrics
def get_metrics(metrics, user_data):
    data = {}

    if not metrics or len(metrics) == 0:
        return data

    for metric in metrics:
        data[metric["key"]] = user_data[metric["key"]]

    return data


# OUTPUTS


def build_expression_attribute_values(conditions, user_data):
    attribute_values = {}

    for condition in conditions:
        for sub_condition in condition:
            field = sub_condition["field"]
            query_value = get_query_dynamo(sub_condition, user_data)
            expression_value = f':{field.replace(".", "_")}'
            attribute_values[expression_value] = query_value

    return attribute_values


def build_filter_expression(conditions):
    expressions = []

    for condition in conditions:
        sub_expressions = []

        for sub_condition in condition:
            field = sub_condition["field"]
            operator = sub_condition["operator"]
            expression_key = f'#{field.replace(".", "_")}'
            expression_value = f':{field.replace(".", "_")}'
            sub_expressions.append(
                f"{expression_key} {get_operator_dynamo(operator)} {expression_value}"
            )

        expressions.append(f'({" AND ".join(sub_expressions)})')

    return " OR ".join(expressions)


def build_expression_attribute_names(conditions):
    attribute_names = {}

    for condition in conditions:
        for sub_condition in condition:
            field = sub_condition["field"]
            expression_key = f'#{field.replace(".", "_")}'
            attribute_names[expression_key] = field

    return attribute_names


def get_products(table_name, product_type, conditions, limit_outputs, user_data):
    dynamodb = boto3.client("dynamodb", region_name="us-east-1")

    exp1 = build_filter_expression(conditions)
    exp2 = build_expression_attribute_values(conditions, user_data)
    exp3 = build_expression_attribute_names(conditions)

    exp1 = f"#output_category = :output_category AND {exp1}"
    exp2[":output_category"] = product_type
    des_exp2 = {k: serializer.serialize(v) for k, v in exp2.items()}
    exp3["#output_category"] = "output_category"

    params = {
        "TableName": table_name,
        "FilterExpression": exp1,
        "ExpressionAttributeValues": des_exp2,
        "ExpressionAttributeNames": exp3,
    }

    try:
        response = dynamodb.scan(**params)
        return response["Items"]
    except Exception as err:
        return {"error": str(err), "products": []}


def evaluate_output(outputs, user_data):
    results = []

    if len(outputs) == 0:
        return results

    for output in outputs:
        limit = output["limit"]
        priority = output["priority"]
        result_out = get_products(
            "segmentation-engine-config-output-catalogues",
            output["catalogue"],
            output["conditions"],
            limit,
            user_data,
        )
        if result_out and len(result_out) > 0:
            results.append({"resultOut": result_out, "priority": priority})

    results.sort(key=lambda x: x["priority"])
    results = [r["resultOut"] for r in results]
    random.shuffle(results)

    return results


def transfromToJson(data):
    deserializer = boto3.dynamodb.types.TypeDeserializer()
    json_data = {k: deserializer.deserialize(v) for k, v in data.items()}
    return json_data


def get_tree(id_rule):
    response = client_dynamodb.get_item(
        TableName="segmentation-engine-config-rules",
        Key={"id_rule": {"S": id_rule}, "rules_category": {"S": "GT"}},
    )
    jsonData = transfromToJson(response["Item"])
    return jsonData


id_rule = args["id_rule"]
filter_users = get_user_from_bucket(args["path"])
tree = get_tree(id_rule)
variables = json.loads(args["variables"])

evaluate_sresf(tree, variables, filter_users)
