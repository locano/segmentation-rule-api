import boto3
import json
import datetime
from boto3.dynamodb.types import TypeDeserializer

client = boto3.client('glue')

def glue_job_result_filter(jobRuns, id_rule):
    if id_rule == '':
        return jobRuns
    else:
        return list(filter(lambda x: 'Arguments' in x and '--id_rule' in x['Arguments'] and x['Arguments']['--id_rule'] == id_rule, jobRuns))

def glue_job_results(jobRuns, id_rule):
    jobData = []
    jobRuns = glue_job_result_filter(jobRuns, id_rule)
    for job in jobRuns:
        id_rule_name = ''
        if 'Arguments' in job and "--id_rule" in job['Arguments']:
            id_rule_name = job['Arguments']['--id_rule']

        jobData.append({
            'JobName': job['JobName'],
            'JobRunId': job['Id'],
            'JobRunState': job['JobRunState'],
            'StartedOn': job['StartedOn'].strftime('%m/%d/%Y'),
            'CompletedOn': job['CompletedOn'].strftime('%m/%d/%Y'),
            'ExecutionTime': job['ExecutionTime'],
            'LogGroupName': job['LogGroupName'],
            'RuleId': id_rule_name,
        })
    return jobData
    
def lambda_handler(event, context):
    try:
        JobName = 'segmentation-engine-core'
        id_rule = ''
        response = client.get_job_runs(
            JobName=JobName
        )
        jobRuns = response['JobRuns']
        nextToken = response.get('NextToken')
        jobResults = []
        jobResults.extend(glue_job_results(jobRuns, id_rule))
        while(nextToken):
            response = client.get_job_runs(
                JobName=JobName,
                NextToken=nextToken
            )
            jobRuns = response['JobRuns']
            nextToken = response.get('NextToken')
            jobResults.extend(glue_job_results(jobRuns, id_rule))
        
        response = {
                "statusCode": 200,
                "body": json.dumps(jobResults),
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
        }
        print(response)
        return response
    
    except Exception as e:
        print(e)


lambda_handler(None, None)