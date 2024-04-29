const Database = require("../database/mongodb")
const db = new Database()

async function GetTasks(req, res) {
    const { id = 'all' } = req.query
    const { role = null, _id } = req.user;
    if (role !== 'admin' && role !== 'root') {
        return res.status(400).send({ success: false, message: 'Unauthorized access' });
    }

    let query;

    if (role == 'admin') {
        if (id == 'all') query = { createdBy: _id }
        else query = { createdBy: _id, id: id }
    } else if (role == 'root') {
        if (id == 'all') query = {}
        else query = { id: id }
    }

    try {
        const { data: tasks } = await db.getLogs(query, 'tasks');
        return res.status(200).send({ success: true, tasks: tasks });
    } catch (error) {
        console.error("Error retrieving tasks:", error);
        return res.status(500).send({ success: false, message: "something went wrong" });
    }
}

module.exports = GetTasks;
