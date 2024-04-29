const Database = require("../database/mongodb");
const db = new Database()

async function GetAllInviteLInks(req, res) {
    try {

        const { _id } = req.user;

        const { data: links = [] } = await db.getLogs({ userId: _id }, 'referralLinks', {}, 150);
        const totalLinksGenerated = await db.countDocuments({ userId: _id }, 'referralLinks')
        const totalRevenue = await db.calculateSum({ fieldName: 'amount', collectionName: 'referralLinks' })

        res.status(200).send({ success: true, totalLinksGenerated, links });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Something went wrong" });
    }
}

module.exports = GetAllInviteLInks;