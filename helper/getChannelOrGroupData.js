const Database = require("../database/mongodb");
const db = new Database()

function getChannelOrGroupData(userId) {
    return new Promise(async (resolve, reject) => {
        try {
            let { data: groups } = await db.getLogs({ userId }, 'associatedChannelsAndGroups')
            const channelOrGroupIds = groups.map(group => group.channelOrGroupId)

            const data = await db.aggregate([
                { $match: { userId, "for.channelOrGroup": { $in: channelOrGroupIds } } },
                { $group: { _id: "$for.channelOrGroup", totalInviteLinks: { $sum: 1 }, links: { $push: "$$ROOT.id" } } },
                { $project: { channelOrGroup: "$_id", totalInviteLinks: 1, links: 1, _id: 0 } }
            ], 'referralLinks')


            const allLinks = data.reduce((acc, link) => acc.concat(link.links), [])

            const allLinksData = await db.aggregate([
                { $match: { userId, type: "referralReward", "metaData.referer": { $in: allLinks } } },
                { $group: { _id: "$metaData.referer", totalAmount: { $sum: "$amount" }, totalReferrals: { $sum: 1 } } },
                { $project: { _id: 0, refererCode: "$_id", totalAmount: 1, totalReferrals: 1 } }
            ], 'transactions');

            const referLinks = {}
            allLinksData.forEach(link => referLinks[(link.refererCode).toString()] = link.totalAmount)

            const channelsAndGroupsWithEarnings = data.map(group => {
                let totalEarnings = 0
                let totalReferrals = 0
                allLinksData.forEach(link => {
                    totalEarnings += link.totalAmount
                    totalReferrals += link.totalReferrals
                })
                const selectedChannelOrGroup = groups.find(channelGroup => channelGroup.channelOrGroupId === group.channelOrGroup)
                let { id = null, admins, totalMembers, ...restChannelOrGroupMetadata } = selectedChannelOrGroup.channelOrGroupMetadata
                const { _id = null, tgUserId = null, userId = null, channelOrGroupMetadata = null, ...restChannelOrGroupData } = selectedChannelOrGroup

                return { ...restChannelOrGroupData, ...restChannelOrGroupMetadata, totalEarnings, totalReferrals: totalReferrals }
            })
            resolve(channelsAndGroupsWithEarnings)
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = getChannelOrGroupData;