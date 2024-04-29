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

        const passwordMatched = await bcrypt.compare(password, hashedPassword);
        if (!passwordMatched) {
            return res.status(400).send({ success: false, message: 'Incorrect password' });
        }

        const currentTime = new Date().getTime()
        const payload = {
            username: userName,
            email: userEmail,
            role,
            permissions,
            createdAt: currentTime
        };

        const lastLogin = currentTime
        const token = jwt.sign(payload, jwtSecret, { expiresIn: '12h' });
        await db.updateLog({ data: { token, lastLogin }, id: { username: userName } }, 'users', false);
        res.status(200).send({ success: true, message: 'User logged in', token });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).send({ success: false, message: 'Something went wrong' });
    }
}

module.exports = Login;
