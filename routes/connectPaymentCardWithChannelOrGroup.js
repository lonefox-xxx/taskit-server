const Database = require("../database/mongodb");
const db = new Database();

async function ConnectPaymentCardWithChannelOrGroup(req, res) {
    try {
        const { channelOrGroupId, paymentCardId = null } = req.body;
        const { _id, tgId = null } = req.user;

        if (!tgId) return res.status(400).send({ success: false, message: "user not connected with telegram" });
        if (!channelOrGroupId || !paymentCardId) return res.status(400).send({ success: false, message: "Missing required fields" });

        const { data: channelAndGroups = [] } = await db.getLogs({ channelOrGroupId, tgUserId: tgId, userId: _id }, 'associatedChannelsAndGroups');
        if (channelAndGroups?.length <= 0) return res.status(400).send({ success: false, message: "Channel or Group not found" });
        const { channelOrGroupId: SelectedChannelOrGroupId } = channelAndGroups[0];

        const { data: paymentCards = [] } = await db.getLogs({ id: paymentCardId }, "paymentCards");
        if (paymentCards?.length < 1 || paymentCards?.length > 1) return res.status(400).send({ success: false, message: "Invalid payment card" });

        await db.updateLog({ id: { channelOrGroupId: SelectedChannelOrGroupId }, data: { paymentCardId, lastUpdated: new Date().getTime() } }, 'associatedChannelsAndGroups')
        res.status(200).send({ success: true, message: "payment card updated" });
    } catch (error) {
        console.error(error)
        res?.status(500)?.send({ success: false, message: 'Something went wrong' })
    }
}

module.exports = ConnectPaymentCardWithChannelOrGroup;