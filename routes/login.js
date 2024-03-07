const Database = require("../database/mongodb");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const jwtSecret = process.env.JSONWEBTOKEN_SECRET;
const db = new Database();

async function Login(req, res) {
    try {
        const { login, password } = req.body;

        if (!login || !password) {
            return res.status(400).send({ success: false, message: 'Missing required fields' });
        }

        const query = { $or: [{ username: login }, { email: login }] };
        const { data: userData = [] } = await db.getLogs(query, 'users');

        if (userData.length !== 1) {
            return res.status(400).send({ success: false, message: userData.length === 0 ? 'No user found' : 'Multiple users found' });
        }

        const { email: userEmail, username: userName, role, permissions, password: hashedPassword } = userData[0];
        if (!userEmail || !userName || !role || !permissions || !hashedPassword) {
            return res.status(400).send({ success: false, message: 'Invalid user data' });
        }

        const passwordMatched = bcrypt.compareSync(password, hashedPassword);
        if (!passwordMatched) {
            return res.status(400).send({ success: false, message: 'Incorrect password' });
        }

        const payload = {
            username: userName,
            email: userEmail,
            role,
            permissions,
            createdAt: new Date().getTime()
        };

        const token = jwt.sign(payload, jwtSecret);
        await db.updateLog({ data: { token }, id: { username: userName } }, 'users', false);
        res.cookie('Auth', token, { secure: true, httpOnly: true, signed: false });
        res.status(200).send({ success: true, message: 'User logged in' });

    } catch (error) {
        res.status(500).send({ success: false, message: 'Something went wrong' });
    }
}

module.exports = Login;
