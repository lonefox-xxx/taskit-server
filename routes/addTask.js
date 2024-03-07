const Database = require("../database/mongodb");
const db = new Database()
const crypto = require('crypto');

function AddTask(req, res) {
    const UserData = req._user
    const newTaskId = crypto.randomBytes(16).toString("hex");
    // if (!UserData) return res.status(400).send({ success: false, message: 'No user data found' })
    const newTask = {
        id: newTaskId,
        createdAt: new Date().getTime(),
    }

    db.addLogs(newTask, 'tasks')

    res.status(200).send({ success: true, message: 'Task added', newTaskId })
}

module.exports = AddTask;