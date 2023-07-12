def get_metrics(metrics, user_data):
    data = {}

    if not metrics or len(metrics) == 0:
        return data

    for metric in metrics:
        data[metric['key']] = user_data[metric['key']]

    return data