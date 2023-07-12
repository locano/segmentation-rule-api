import json
import boto3
import csv
import time
import random
from evaluation import *
from segments import *

def lambda_handler(event, context):

    users = get_user_from_bucket(event["path"])
    evaluate_sresf(event["tree"],event["variables"],users) 
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps('Evaluation Completed!')
    }
