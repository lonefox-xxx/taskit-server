const Database = require("../database/mongodb");
const db = new Database()

async function TurnOnChannelsAndGroups(req, res) {
    try {
        const { TgUserId, channelOrGroupId = 'all' } = req.body

        if (!TgUserId) return res.status(400).send({ success: false, message: "Missing required fields" })

        let id

        if (channelOrGroupId === 'all') {
            id = { tgUserId: TgUserId }
        } else {
            id = { tgUserId: TgUserId, channelOrGroupId }
        }

        await db.updateLog({ id, data: { status: 1 } }, 'associatedChannelsAndGroups', false)
        res.status(200).send({ success: true, msg: 'success' })

    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: 'Something went wrong' })
    }
}

module.exports = TurnOnChannelsAndGroups;