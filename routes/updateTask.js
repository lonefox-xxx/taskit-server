const Database = require("../database/mongodb");
const db = new Database()

async function UpdateTask(req, res) {
    const { taskParams = null, id = null } = req.body
    const { role = null, permissions = [], _id } = req.user;
    delete taskParams._id

    if (role !== 'admin' && role !== 'root') return res.status(400).send({ success: false, message: 'Unauthorized access' })
    if (!permissions.includes('Edit Tasks') && role !== 'root') return res.status(400).send({ success: false, message: 'Insufficient privileges' });

    if (!id) return res.status(400).send({ success: false, message: 'No task found' })
    if (!taskParams) return res.status(400).send({ success: false, message: 'No task parameters provided' })
    // if (!UserData) return res.status(400).send({ success: false, message: 'No user data found' })

    const { data: task } = await db.getLogs({ id: id }, 'tasks')
    if (!task || task.length <= 0 || task.length > 1) return res.status(400).send({ success: false, message: 'No task found' })

    const updaters = [...new Set([...(task[0]?.updaters || []), _id])]
    taskParams.updaters = updaters

    const updateTaskRes = await db.updateLog({ id: { id }, data: taskParams }, 'tasks', false)
    res.status(200).send({ success: true, message: 'Task updated' })
}

module.exports = UpdateTask;