const Database = require("../database/mongodb");
const db = new Database()

async function GetAllInviteLInks(req, res) {
    try {
        const { _id } = req.user;
        const [links, linksData, totalLinks] = await Promise.all([
            calculateLinks(_id),
            calculateLinkData(_id),
            db.countDocuments({ userId: _id }, 'referralLinks')
        ])
        res.status(200).send({ success: true, links, metadata: { ...linksData, totalLinks } });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Something went wrong" });
    }
}

module.exports = GetAllInviteLInks;

async function calculateLinks(userId) {
    let { data: linkIds } = await db.getLogs({ userId }, 'referralLinks', {}, 150)
    const links = linkIds.map(linkId => linkId.id)
    const data = await db.aggregate([
        {
            $match: { userId, type: "referralReward", "metaData.referer": { $in: links } }
        },
        {
            $group: {
                _id: "$metaData.referer",
                totalTransactions: { $sum: "$amount" },
                totalTransactionsCount: { $sum: 1 },
                transactions: { $push: "$$ROOT" }
            }
        },
    ], 'transactions');

    const finalData = linkIds.map(linkId => {
        let linkData = data.find(link => link._id === linkId.id)
        const combinedData = { ...linkId, ...linkData }
        return combinedData
    }).map(link => {
        if (link.transactions) {
            const { _id, userId, amount, ...rest } = link
            const modifiedTransactions = link.transactions.map(transaction => {
                const { _id, metaData, userId, ...rest } = transaction
                return rest
            });
            return { ...rest, transactions: modifiedTransactions };
        } else {
            const { _id, userId, amount, ...rest } = link
            return rest;
        }
    }).sort((a, b) => a.createdOn - b.createdOn)

    return finalData
}

async function calculateLinkData(userId) {
    const data = await db.aggregate([
        {
            $match: { userId, type: "referralReward", }
        },
        {
            $group: {
                _id: null,
                totalTransactions: { $sum: "$amount" },
                totalTransactionsCount: { $sum: 1 },
            }
        },
        {
            $project: {
                _id: 0,
                totalTransactions: 1,
                totalTransactionsCount: 1
            }
        }
    ], 'transactions');

    return data[0]
}