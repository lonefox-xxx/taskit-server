const Database = require("../database/mongodb");
const db = new Database()

async function PublishTask(req, res) {
    const { taskId } = req.body
    const { role = null, permissions = [] } = req.user;

    if (role !== 'admin' && role !== 'root') {
        return res.status(400).send({ success: false, message: 'Unauthorized access' });
    }
    if (!permissions.includes('Publish Tasks') && role !== 'root') {
        return res.status(400).send({ success: false, message: 'Insufficient privileges' });
    }

    let { data: task } = await db.getLogs({ id: taskId }, 'tasks')
    if (!task || task.length <= 0) return res.status(404).send({ success: false, message: 'Task not Found' })
    task = task[0]

    const taskValidToPublish = task.id && task.confirmed && !task.published && task.name && task.maxLimit && task.updaters && task.paymentMethod && task.perUser && task.perRefer && task.perTaskCompletion && task.steps && task.proofs

    if (taskValidToPublish) {
        return res.status(200).send({ success: true, msg: 'Task Published' })
    } else {
        let msg;
        if (!task.confirmed) msg = 'task not confirmed'
        if (task.published) msg = 'task already published'
        else msg = 'task not valid for publish'

        return res.status(400).send({ success: false, msg })
    }
}

module.exports = PublishTask;