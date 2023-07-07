def get_megabytes_size(data):
    json_string = json.dumps(data)
    size = len(json_string.encode())
    kilo_bytes = size / 1024
    mega_bytes = kilo_bytes / 1024
    return mega_bytes

async def get_result_data(results, name):
    mega_bytes = get_megabytes_size(results)

    try:
        s3 = boto3.client('s3')
        filename = f"{name.replace(' ', '_')}_{int(time.time())}.json"
        params = {
            'Bucket': 'amplify-segmentationruleapi-dev-84649-deployment/evaluation-results',
            'Key': filename,
            'Body': json.dumps(results),
            'Expires': 60 * 60
        }
        await s3.put_object(**params)

        if mega_bytes > 5:
            return {
                'results': results[:200],
                'message': 'Data size is greater than 4MB and has been saved in S3, you can see a preview in the results',
                'stored': True,
                'link': f'https://amplify-segmentationruleapi-dev-84649-deployment/evaluation-results/{filename}'
            }
        else:
            return {
                'results': results,
                'message': 'Data size is less than 4MB you can see the results',
                'stored': True,
                'link': f'https://amplify-segmentationruleapi-dev-84649-deployment/evaluation-results/{filename}'
            }
    except Exception as e:
        return {
            'results': [],
            'message': str(e) or 'Error saving data in S3',
            'stored': True
        }
