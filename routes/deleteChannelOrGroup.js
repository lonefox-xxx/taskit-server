const Database = require("../database/mongodb");
const db = new Database()

async function DeleteChannelOrGroup(req, res) {
    const { channelOrGroupId } = req.body
    const { _id } = req.user
    if (!channelOrGroupId) return res.status(400).send({ success: false, message: 'Missing required fields' })
    try {
        const data = await db.clearLogs({ channelOrGroupId, userId: _id }, 'associatedChannelsAndGroups')
        if (data.deletedCount === 0) return res.status(404).send({ success: false, message: 'Channel or Group Not Found' })
        return res.status(200).send({ success: true, message: 'Channel or Group Deleted' })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, message: 'Something went wrong' })
    }
}

module.exports = DeleteChannelOrGroup;