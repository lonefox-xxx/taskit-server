const jwt = require('jsonwebtoken');
const jwtSecret = process.env.TASK_TOKEN_JSONWEBTOKEN_SECRET;


function ValidateTaskToken(taskToken) {
    try {
        const tokenData = jwt.verify(taskToken, jwtSecret);
        return { verified: true, data: tokenData };
    } catch (error) {
        return { verified: false, data: null };
    }
}

module.exports = ValidateTaskToken;