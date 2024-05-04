const getChannelOrGroupData = require("../helper/getChannelOrGroupData");

async function GetReferralProgramChannelsAndGroups(req, res) {
    try {
        const { _id: userId } = req.user
        const channelsAndGroupsWithEarnings = await getChannelOrGroupData(userId)
        res.status(200).send({ success: true, channelsAndGroups: channelsAndGroupsWithEarnings })
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Something went wrong" })
    }
}

module.exports = GetReferralProgramChannelsAndGroups;