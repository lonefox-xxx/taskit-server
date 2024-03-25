const Database = require("../database/mongodb");
const db = new Database()

async function UpdateUserPermissions(req, res) {
    try {
        const { permissions = [], userId } = req.body
        const { role = null, permissions: userPermissions = [], _id } = req.user;
        if (role !== 'admin' && role !== 'root') return res.status(400).send({ success: false, message: 'Unauthorized access' })
        if (!userPermissions.includes('Edit User Permissions') && role !== 'root') return res.status(400).send({ success: false, message: 'Insufficient privileges' });

        const allowedPermissions = ['Add Tasks', 'Edit Tasks', 'Delete Tasks', 'Publish Tasks', 'Verify Tasks', 'Release Tasks Reward', 'Send/Edit Task Messages', 'Add Users', 'Edit Users', 'Delete Users', 'Ban Users', 'Add Admins', 'Edit Admins', 'Remove Admins', 'Edit User Permissions']
        const CleanedPermissions = permissions.filter(permission => allowedPermissions.includes(permission))

        const id = { $or: [{ _id: userId }, { username: userId }, { email: userId }] }
        await db.updateLog({ id, data: { permissions: CleanedPermissions } }, 'users', false)
        res.status(200).send({ success: true, message: 'User permissions updated' })
    } catch (error) {
        res.status(400).send({ success: false, message: 'something went wrong' });
    }
}

module.exports = UpdateUserPermissions;