const Database = require("../database/mongodb");
const { EncryptData } = require("../utils/encryptionAndDecryption");
const db = new Database();

async function GenerateChannelOrGroupToken(req, res) {
    const { channelOrGroupId, tgUserId, channelMetaData } = req.body;
    if (!channelOrGroupId || !tgUserId || !channelMetaData) return res.status(400).send({ success: false, message: "Missing required fields" });

    const { data: channelsOrGroups = [] } = await db.getLogs({ channelOrGroupId }, "associatedChannelsAndGroups");
    if (channelsOrGroups?.length > 1) return res.status(400).send({ success: false, message: "Channel or Group already exists" });

    const expDate = new Date(Date.now() + 43200000);
    const encryptData = {
        exp: expDate.getTime(),
        tgUserId,
        channelOrGroupId,
        channelMetaData
    }

    const { iv, encryptedData } = EncryptData(JSON.stringify(encryptData));
    const token = `${encryptedData}:${iv}`;
    res.status(200).send({ success: true, token });
}

module.exports = GenerateChannelOrGroupToken;