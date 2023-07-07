async def get_metrics(metrics, user_data):
    data = {}

    if not metrics or len(metrics) == 0:
        return data

    await asyncio.gather(*[
        asyncio.create_task(assign_data(metric, data, user_data))
        for metric in metrics
    ])

    return data

async def assign_data(metric, data, user_data):
    data[metric['key']] = user_data[metric['key']]