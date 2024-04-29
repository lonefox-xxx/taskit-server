const jwt = require('jsonwebtoken');
const Database = require("../database/mongodb");
const db = new Database()

const jwtSecret = process.env.TASK_TOKEN_JSONWEBTOKEN_SECRET

async function registerTask(req, res) {
    try {
        const { id, name, email, upi } = req.body
        if (!id || !name || !email || !upi) return res.status(400).send({ success: false, message: "Missing required fields" })

        let { data: task } = await db.getLogs({ id }, 'tasks')
        if (!task || task?.length <= 0) return res.status(400).send({ success: false, message: "Task not Found" })
        task = task[0] || {}

        if (task.status == 'completed') return res.status(400).send({ success: false, message: "Task already completed" })
        if (task.status != 'published') return res.status(400).send({ success: false, message: "Task not Found" })

        const payload = {
            id,
            name,
            email,
            upi,
            createdAt: new Date().getTime()
        }
        const token = jwt.sign(payload, jwtSecret)
        res.status(200).send({ success: true, message: "task user created", taskToken: token })
    } catch (error) {
        console.error(error)
        res.status(500).send({ success: false, message: "something went wrong" })
    }

}

module.exports = registerTask;