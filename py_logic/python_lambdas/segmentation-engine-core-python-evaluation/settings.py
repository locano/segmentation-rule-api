def check_settings(outputs, settings):
    if not settings or len(settings) == 0:
        return outputs[0]
    
    filter_outputs = outputs[0]
    
    for element in settings:
        if element["key"] == "outputs_per_user":
            filter_outputs = outputs[0][:element["value"]]
            break
    
    return filter_outputs