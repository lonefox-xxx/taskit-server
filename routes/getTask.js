const Database = require("../database/mongodb");
const db = new Database()
const jwt = require('jsonwebtoken');
const RegisterImpression = require("./registerImpression");

const jwtSecret = process.env.JSONWEBTOKEN_SECRET

async function GetTask(req, res) {
    const { id, name, email, upi } = req.body
    if (!id || !name || !email || !upi) return res.status(400).send({ success: false, message: "Missing required fields" })

    const { data: task } = await db.getLogs({ id }, 'tasks')
    if (!task || task?.length <= 0) return res.status(400).send({ success: false, message: "Task not Found" })

    await RegisterImpression(id)
    const payload = {
        id,
        name,
        email,
        upi,
        createdAt: new Date().getTime()
    }
    const token = jwt.sign(payload, jwtSecret)

    res.status(200).send({ success: true, message: "User created", redirectUri: task[0]?.redirectUri, taskToken: token })
}

module.exports = GetTask;