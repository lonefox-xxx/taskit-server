const Database = require("../database/mongodb");
const db = new Database()

async function UpdateChannelOrGroupStatus(req, res) {
    const { channelOrGroupId = null, status = 1 } = req.body
    const { _id } = req.user
    if (!channelOrGroupId) return res.status(400).send({ success: false, message: 'Missing required fields' })
    if (![0, 1].includes(status)) return res.status(400).send({ success: false, message: 'invalid parameters provided' })

    try {
        const { data: channelAndGroups } = await db.getLogs({ channelOrGroupId, userId: _id }, 'associatedChannelsAndGroups')
        if (channelAndGroups?.length <= 0) return res.status(404).send({ success: false, message: 'Channel or Group Not Found' })
        if (channelAndGroups[0].status === status) return res.status(400).send({ success: false, message: 'Channel or Group Status Already Updated' })
        if (!channelAndGroups[0].paymentCardId) return res.status(400).send({ success: false, message: 'plz connect with a payment card first' })

        const data = await db.updateLog({ id: { channelOrGroupId, userId: _id }, data: { status: +status, lastUpdated: new Date().getTime() } }, 'associatedChannelsAndGroups')
        if (data.matchedCount <= 0) return res.status(404).send({ success: false, message: 'Channel or Group Not Found' })
        return res.status(200).send({ success: true, message: 'Channel or Group Status Updated' })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, message: 'Something went wrong' })
    }
}

module.exports = UpdateChannelOrGroupStatus;