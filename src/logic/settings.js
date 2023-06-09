

async function checkSettings(outputs, settings) {

    if (!settings || settings.length == 0) {
        return outputs[0];
    }
    let filterOutputs = outputs[0];
    
    settings.forEach(element => {
        switch (element.key) {
            case "campaigns_per_user":
                filterOutputs = outputs[0].slice(0, element.value);
                break;
        }
    });

    return filterOutputs;

}

module.exports = { checkSettings }