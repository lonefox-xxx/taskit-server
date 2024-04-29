const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JSONWEBTOKEN_SECRET;
const Database = require('../database/mongodb');
const db = new Database();

async function Auth(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            const tokenAuthorized = jwt.verify(token, jwtSecret);
            const { data: userData } = await db.getLogs({ username: tokenAuthorized.username }, 'users')
            const { token: userToken } = userData[0]
            if (userToken != token) return res.status(401).json({ success: false, message: 'authorization expired' });
            req.user = userData[0];
            next();
        } else {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
    } catch (error) {
        console.log(error.message)
        if (error.message == 'jwt expired') res.status(404).json({ success: false, message: 'Authentication expired' });
        else res.status(400).json({ success: false, message: 'Bad request' });
    }
}

module.exports = Auth;
