const Database = require("../database/mongodb");
const db = new Database();

async function ConnectPaymentCardWithChannelOrGroup(req, res) {
    try {
        const { channelOrGroupId, paymentCardId = null } = req.body;
        const { _id, tgUserId = null } = req.user;

        if (!tgUserId) return res.status(400).send({ success: false, message: "user not connected with telegram" });
        if (!channelOrGroupId || !paymentCardId) return res.status(400).send({ success: false, message: "Missing required fields" });

        const { data: channelAndGroups = [] } = await db.getLogs({ channelOrGroupId, tgUserId, userId: _id }, 'associatedChannelsAndGroups');
        if (channelAndGroups?.length <= 0) return res.status(400).send({ success: false, message: "Channel or Group not found" });
        const { channelOrGroupId: SelectedChannelOrGroupId } = channelAndGroups[0];

        const { data: paymentCards = [] } = await db.getLogs({ id: paymentCardId }, "paymentCards");
        if (paymentCards?.length < 1 || paymentCards?.length > 1) return res.status(400).send({ success: false, message: "Invalid payment card" });

        await db.updateLog({ id: { channelOrGroupId: SelectedChannelOrGroupId }, data: { paymentCardId, status: 1, lastUpdated: new Date().getTime() } }, 'associatedChannelsAndGroups')
        res.status(200).send({ success: true, message: "channel or group updated" });
    } catch (error) {
        console.error(error)
        res?.status(500)?.send({ success: false, message: 'Something went wrong' })
    }
}

module.exports = ConnectPaymentCardWithChannelOrGroup;