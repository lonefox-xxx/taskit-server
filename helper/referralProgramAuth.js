const jwt = require('jsonwebtoken');
const Database = require('../database/mongodb');
const jwtSecret = process.env.REFERRAL_PROGRAM_JSONWEBTOKEN_SECRET;
const db = new Database();

async function ReferralProgramAuth(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            const tokenAuthorized = jwt.verify(token, jwtSecret);
            const { data: userData } = await db.getLogs({ username: tokenAuthorized.username }, 'referralProgramUsers')
            const { token: userToken } = userData[0]
            if (userToken != token) return res.status(401).json({ success: false, message: 'authorization expired', redir: '/referralProgram/authenticate/login' });
            req.user = userData[0];
            next();
        } else {
            res.status(401).json({ success: false, message: 'Unauthorized', redir: '/referralProgram/authenticate/login' });
            return;
        }
    } catch (error) {
        // console.log(error.message)
        if (error.message == 'jwt expired') res.status(404).json({ success: false, message: 'Authentication expired', redir: '/referralProgram/authenticate/login' });
        if (error.message == 'jwt must be provided') res.status(404).json({ success: false, message: 'Authentication required', redir: '/referralProgram/authenticate/login' });
        else res.status(400).json({ success: false, message: 'Bad request', redir: '/referralProgram/authenticate/login' });
    }
}

module.exports = ReferralProgramAuth;
