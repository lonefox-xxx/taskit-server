const Database = require("../database/mongodb")
const db = new Database()
const crypto = require('crypto');
const bcrypt = require('bcrypt');

async function ReferralProgramRegister(req, res) {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) return res.status(400).send({ success: false, message: 'Missing required fields' })

        const { data: existUsers } = await db.getLogs({ $or: [{ username }, { email }] }, 'referralProgramUsers')
        if (existUsers.length > 0) return res.status(400).send({ success: false, message: 'username or email already exist' })

        const id = crypto.randomBytes(16).toString("hex");
        const hashedPassword = bcrypt.hashSync(password, 10)

        await db.addLogs({
            _id: id,
            username,
            email,
            password: hashedPassword,
            token: null,
            createdAt: new Date().getTime()
        }, 'referralProgramUsers')

        res.status(200).send({ success: true, message: 'Registration completed' })

    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'something went wrong' })
    }
}

module.exports = ReferralProgramRegister;