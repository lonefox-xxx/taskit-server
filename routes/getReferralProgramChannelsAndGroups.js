const Database = require("../database/mongodb");
const db = new Database()

async function GetReferralProgramChannelsAndGroups(req, res) {
    try {
        const { _id } = req.user
        let { data: channelsAndGroups = [] } = await db.getLogs({ userId: _id }, "associatedChannelsAndGroups");
        channelsAndGroups = channelsAndGroups.map(channel => {
            // console.log(channel)
            const { id = null, admins = null, ...restChannelOrGroupMetadata } = channel.channelOrGroupMetadata
            const { _id = null, tgUserId = null, userId = null, channelOrGroupMetadata = null, ...rest } = channel
            return { ...rest, ...restChannelOrGroupMetadata }
        })
        res.status(200).send({ success: true, channelsAndGroups: channelsAndGroups })
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Something went wrong" })
    }
}

module.exports = GetReferralProgramChannelsAndGroups;