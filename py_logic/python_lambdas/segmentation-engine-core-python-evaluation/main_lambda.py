import json
import boto3
import csv
import time
import random
from evaluation import *
from segments import *


def transfromToJson(data):
    deserializer = boto3.dynamodb.types.TypeDeserializer()
    json_data = {k: deserializer.deserialize(v) for k,v in data.items()}
    return json_data


def get_tree(id_rule):
    response = client_dynamodb.get_item(
        TableName='segmentation-engine-config-rules',
        Key={
            'id_rule': {
                'S': id_rule
            },
            'rules_category': {
                'S': 'GT'
            }
        }
    )
    jsonData = transfromToJson(response['Item'])
    return jsonData


def lambda_handler(event, context):
    print(event)
    users = get_user_from_bucket(event["path"])
    print("users", len(users))
    tree = get_tree(event["id_rule"])
    evaluate_sresf(tree,event["variables"],users) 
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps('Evaluation Completed!')
    }
