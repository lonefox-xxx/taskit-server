const Database = require("../database/mongodb");
const db = new Database()

async function GetTaskSteps(req, res) {
    try {
        const { id } = req.query
        if (!id) return res.status(400).send({ success: false, message: "Missing required fields" })

        let { data: task } = await db.getLogs({ id }, 'tasks')
        if (!task || task?.length <= 0) return res.status(400).send({ success: false, message: "Task not Found" })
        task = task[0] || {}

        if (task.status == 'completed') return res.status(400).send({ success: false, message: "Task already completed" })
        if (task.status != 'published') return res.status(400).send({ success: false, message: "Task not Found" })

        res.status(200).send({ success: true, steps: task.steps })
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "something went wrong" })
    }
}

module.exports = GetTaskSteps;