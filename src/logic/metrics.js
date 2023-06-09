async function getMetrics(metrics, userData) {
    let m = [];

    if (!metrics || metrics.length == 0) {
        return m;
    }

    await Promise.all(
        metrics.map(async metric => {
            let data = {};
            data[metric.key] = userData[metric.key];
            m.push(data);
        })
    );

    return m;
}

module.exports = { getMetrics }