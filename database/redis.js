const { createClient } = require('redis');

const { REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } = process.env
const RedisClient = createClient({
    password: REDIS_PASSWORD,
    socket: {
        host: REDIS_HOST,
        port: REDIS_PORT
    }
});

(async () => {
    try {
        const d = await RedisClient.connect()
    } catch (error) {
        console.log(error)
    }
})()

RedisClient.on('connect', () => {
    console.log('Connected to Redis');
});

RedisClient.on('error', (err) => {
    console.log(`Error: ${err}`);
});


module.exports = RedisClient;
