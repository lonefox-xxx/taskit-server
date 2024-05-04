const Database = require("../database/mongodb");
const getChannelOrGroupData = require("../helper/getChannelOrGroupData");
const GetTimestampOfFirstDayOfYear = require("../utils/getTimestampOfFirstDayOfYear");
const db = new Database();

async function GetAllTransactions(req, res) {
    try {
        const { _id } = req.user;

        const { startDate, endDate } = GetTimestampOfFirstDayOfYear();

        const [dailyTransactions, { data: transactions }, channelOrGroupData] = await Promise.all([
            db.aggregate([
                { $match: { userId: _id, status: 'success', type: "referralReward", "created.timestamp": { $lte: endDate, $gte: startDate } } },
                { $group: { _id: "$created.dateString", timestamp: { $first: "$created.timestamp" }, totalTransactions: { $sum: "$amount" } } },
                { $project: { date: "$_id", totalTransactions: 1, timestamp: 1, _id: 0 } }
            ], 'transactions'),
            db.getLogs({ userId: _id, status: 'success', type: "referralReward" }, 'transactions', {}, 150),
            getChannelOrGroupData(_id)
        ]);

        const sanitizedTransactions = transactions.map(transaction => {
            const { _id, userId, metaData, ...rest } = transaction;
            return rest;
        });

        res.status(200).send({ success: true, dailyTransactions, transactions: sanitizedTransactions, channelOrGroupData });
    } catch (error) {
        console.error("Error in GetAllTransactions:", error.message || error);
        res.status(500).send({ success: false, message: "Something went wrong" });
    }
}

module.exports = GetAllTransactions;
