const Database = require("../database/mongodb");
const db = new Database()

async function GetReferralProgramTransactions(req, res) {
    try {
        const { _id } = req.user;
        const transactions = await db.getLogs({ userId: _id }, "transactions");
        res.status(200).send({ success: true, transactions: transactions })
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Something went wrong" });
    }
}

module.exports = GetReferralProgramTransactions;