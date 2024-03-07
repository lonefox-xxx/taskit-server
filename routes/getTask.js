const Database = require("../database/mongodb");
const db = new Database()
const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JSONWEBTOKEN_SECRET

async function GetTask(req, res) {
    const { id, name, email, upi } = req.body

    if (!id || !name || !email || !upi) return res.status(400).send({ success: false, message: "Missing required fields" })
    const payload = {
        id,
        name,
        email,
        upi,
        createdAt: new Date().getTime()
    }
    const token = jwt.sign(payload, jwtSecret)

    const expiryDate = new Date((Date.now() + 3600000) * 12); // 12 hours from now;
    res.cookie('taskToken', token, { secure: true, httpOnly: true, sameSite: 'strict', expires: expiryDate, signed: false });
    res.status(200).send({ success: true, message: "User created", redirectUri: 'https://google.com' })
}

module.exports = GetTask;