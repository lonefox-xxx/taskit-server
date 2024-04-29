const Database = require("../database/mongodb");
const db = new Database()

async function ConfirmTask(req, res) {
    const { id = null, verificationCode = null } = req.body
    const { role = null, permissions = [], _id } = req.user;
    delete taskParams._id

    if (role !== 'admin' && role !== 'root') return res.status(400).send({ success: false, message: 'Unauthorized access' })
    if (!permissions.includes('Confirm Tasks') && role !== 'root') return res.status(400).send({ success: false, message: 'Insufficient privileges' });

    if (!id) return res.status(400).send({ success: false, message: 'No task found' })
    const { data: task } = await db.getLogs({ id: id }, 'tasks')
    if (!task || task.length <= 0 || task.length > 1) return res.status(400).send({ success: false, message: 'No task found' })

    if (!verificationCode) {
        return res.status(400).send({ success: false, message: 'verification code sent successfully' })
    }
}

module.exports = ConfirmTask;