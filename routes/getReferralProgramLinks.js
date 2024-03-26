const Database = require("../database/mongodb");
const db = new Database()

async function GetReferralProgramLinks(req, res) {
    try {
        const { _id } = req.user;
        const { data: links = [] } = await db.getLogs({ userId: _id }, "referralLinks", {}, 50);
        const totalLinks = await db.countDocuments({ userId: _id }, 'referralLinks')
        res.status(200).send({ success: true, totalLinks, links })
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Something went wrong" });
    }
}

module.exports = GetReferralProgramLinks;