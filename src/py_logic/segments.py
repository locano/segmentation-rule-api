import boto3
import csv
import json
def get_user_from_bucket(path):
    try:
        if path is None:
            return []

        s3_client = boto3.client('s3')

        data = path.split("//")
        bucket = data[1].split("/")[0]
        key = path.split(bucket + "/")[1]

        # Get the file inside the S3 Bucket
        s3_response = s3_client.get_object(
            Bucket= bucket,
            Key= key
        )
        # Get the Body object in the S3 get_object() response
        s3_object_body = s3_response.get('Body')
        read = csv.DictReader(s3_object_body.read().decode('utf-8').splitlines())
        users = list(read)
        return users
        
    except Exception as e:
        print(e)
        return []
