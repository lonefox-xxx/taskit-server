const RedisClient = require("../database/redis");

async function RegisterImpression(taskId) {
    try {
        // Get the current timestamp
        const currentTime = (new Date().getTime() / 1000).toFixed(0);

        // Increment the impression count for the specific task
        await RedisClient.hIncrBy(`Impressions:${taskId}`, currentTime.toString(), 1);

        // Increment the impression count for all tasks
        await RedisClient.hIncrBy('Impressions:All', currentTime.toString(), 1);

        return true;
    } catch (error) {
        console.error('Error registering impression:', error);
        return false;
    }
}

module.exports = RegisterImpression;
