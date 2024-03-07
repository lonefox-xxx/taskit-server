const Database = require("../database/mongodb");
const db = new Database()

async function UpdateTask(req, res) {
    const { taskParams = null, id = nul } = req.body
    const UserData = req._user

    if (!id) return res.status(400).send({ success: false, message: 'No task found' })
    if (!taskParams) return res.status(400).send({ success: false, message: 'No task parameters provided' })
    // if (!UserData) return res.status(400).send({ success: false, message: 'No user data found' })

    const updateTaskRes = await db.updateLog({ id: { id }, data: taskParams }, 'tasks', false)
    res.status(200).send({ success: true, message: 'Task updated' })
}

module.exports = UpdateTask;