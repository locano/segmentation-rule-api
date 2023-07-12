import boto3
import csv
import time
import json
import random
from evaluation import *
from segments import *

f = open('./src/py_logic/tree.json')
tree = json.load(f)
variables = {}

path = 's3://sagemaker-gt-us-east-1-mlops/athena-output/6c52353d-b186-4f36-a4db-b768a780c6fe.csv'
  
filter_users = get_user_from_bucket(path)
evaluate_sresf(tree,variables,filter_users)