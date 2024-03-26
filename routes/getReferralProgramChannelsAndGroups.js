const Database = require("../database/mongodb");
const db = new Database()

async function GetReferralProgramChannelsAndGroups(req, res) {
    try {
        const { _id } = req.user
        const { data: channelsAndGroups = [] } = await db.getLogs({ userId: _id }, "associatedChannelsAndGroups");
        res.status(200).send({ success: true, channelsAndGroups: channelsAndGroups })
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Something went wrong" })
    }
}

module.exports = GetReferralProgramChannelsAndGroups;