const RedisClient = require("../database/redis");

async function GetImpressions(req, res) {
    const { id = 'All' } = req.query
    const { role = null } = req.user;

    if (role !== 'admin' && role !== 'root') {
        return res.status(400).send({ success: false, message: 'Unauthorized access' });
    }

    const impressions = await RedisClient.hGetAll(`Impressions:${id}`);
    res.status(200).send({ success: true, ImpressionData: JSON.parse(JSON.stringify(impressions)) })
}

module.exports = GetImpressions;