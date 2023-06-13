async function getMetrics(metrics, userData) {
    let data =  {

    };

    if (!metrics || metrics.length == 0) {
        return data;
    }

    await Promise.all(
        metrics.map(async metric => {
            data[metric.key] = userData[metric.key];
        })
    );

    return data;
}

module.exports = { getMetrics }