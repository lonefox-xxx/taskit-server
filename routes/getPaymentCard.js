const Database = require("../database/mongodb")
const db = new Database()

async function GetPaymentCard(req, res) {
    try {
        const { _id } = req.user
        let { data: paymentCard = [] } = await db.getLogs({ userId: _id }, 'paymentCards')
        paymentCard = paymentCard.map(card => {
            const { _id, ...rest } = card
            return rest
        })
        let { data: transactions = [] } = await db.getLogs({ userId: _id }, 'transactions', { createdAt: -1 }, 200)
        transactions = transactions.map(transaction => {
            const { _id, ...rest } = transaction
            return rest
        })
        const data = { paymentCard, transactions }
        res.status(200).send({ success: true, message: 'Payment Cards fetched', data })
    } catch (error) {
        console.error(error)
        res.status(500).send({ success: false, message: 'Something went wrong' })
    }

}

module.exports = GetPaymentCard;