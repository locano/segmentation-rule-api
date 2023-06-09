

async function checkSettings(outputs, settings) {

    if (!settings || settings.length == 0) {
        return outputs[0];
    }

    settings.forEach(element => {
        switch (element.key) {
            case "campaigns_per_user":
                outputs = outputs.slice(0, element.value);
                break;
        }
    });

    return outputs[0];

}

module.exports = { checkSettings }