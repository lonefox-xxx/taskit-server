const Database = require("../database/mongodb");
const db = new Database()
const crypto = require('crypto');

function AddTask(req, res) {
    const { role = null, permissions = [], _id = null } = req.user;

    if (role !== 'admin' && role !== 'root') {
        return res.status(400).send({ success: false, message: 'Unauthorized access' });
    }
    if (!permissions.includes('Add Tasks') && role !== 'root') {
        return res.status(400).send({ success: false, message: 'Insufficient privileges' });
    }

    const newTaskId = crypto.randomBytes(16).toString("hex");
    const newTask = {
        id: newTaskId,
        status: 'pending',
        createdBy: _id,
        createdAt: new Date().getTime(),
    }

    db.addLogs(newTask, 'tasks');

    res.status(200).send({ success: true, message: 'Task added', newTaskId });
}

module.exports = AddTask;
