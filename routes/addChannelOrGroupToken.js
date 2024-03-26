const Database = require("../database/mongodb");
const { DecryptData } = require("../utils/encryptionAndDecryption");
const db = new Database();

async function AddChannelOrGroupToken(req, res) {
    try {
        const { token = null, paymentCardId = null } = req.body;
        const { _id, tgUserId = null } = req.user;

        if (!tgUserId) return res.status(400).send({ success: false, message: "user not connected with telegram" });
        if (!token || !paymentCardId) return res.status(400).send({ success: false, message: "Missing required fields" });

        const [tokenDecryptedData, iv] = token.split(':')
        if (!tokenDecryptedData || !iv) return res.status(400).send({ success: false, message: "Invalid token" });
        let decryptedData = DecryptData(tokenDecryptedData, iv);
        decryptedData = JSON.parse(decryptedData) || null
        if (!decryptedData) return res.status(400).send({ success: false, message: "Invalid token" });

        const { exp, tgUserId: decryptedTgUserId, channelOrGroupId, channelMetaData = null } = decryptedData
        if (!exp || !decryptedTgUserId || !channelOrGroupId || !channelMetaData) return res.status(400).send({ success: false, message: "Invalid token" });
        if (exp < Date.now()) return res.status(400).send({ success: false, message: "Token expired" });
        const { data: channelsOrGroups = [] } = await db.getLogs({ channelOrGroupId }, "associatedChannelsAndGroups");
        if (channelsOrGroups?.length >= 1) return res.status(400).send({ success: false, message: "Channel or Group already exists" });
        if (tgUserId != decryptedTgUserId) return res.status(400).send({ success: false, message: "token not valid for this user" });

        const { data: paymentCards = [] } = await db.getLogs({ id: paymentCardId }, "paymentCards");
        if (paymentCards?.length < 1 || paymentCards?.length > 1) return res.status(400).send({ success: false, message: "Invalid payment card" });

        await db.addLogs({ channelOrGroupId, tgUserId, userId: _id, channelMetaData, paymentCardId, status: 1, createdAt: new Date().getTime() }, "associatedChannelsAndGroups");
        res.status(200).send({ success: true, message: "channel or group added" });
    } catch (error) {
        console.error(error)
        res?.status(500)?.send({ success: false, message: 'Something went wrong' })
    }
}

module.exports = AddChannelOrGroupToken;