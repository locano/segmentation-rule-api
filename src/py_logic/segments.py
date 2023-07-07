async def get_user_from_bucket(path):
    try:
        if path is None:
            return []

        s3 = boto3.client('s3')
        data = path.split("//")
        bucket = data[1].split("/")[0]
        key = path.split(bucket + "/")[1]

        get_params = {
            'Bucket': bucket,
            'Key': key
        }
        response = s3.get_object(**get_params)
        stream = response['Body']
        reader = csv.DictReader(stream.read().decode('utf-8').splitlines())
        json_data = list(reader)
        
        return json_data
    except Exception as e:
        print(e)
        return []
