const Database = require("../database/mongodb")
const db = new Database

async function updatePaymentCard(req, res) {
    try {
        const { id, upiId, name } = req.body
        const { _id } = req.user
        if (!id || !upiId, !name) return res.status(400).send({ success: false, message: 'Missing required fields' })

        const { modifiedCount } = await db.updateLog({ id: { userId: _id, id }, data: { upiId, name } }, 'paymentCards')
        if (modifiedCount === 0) return res.status(404).send({ success: false, message: 'Nothing to Update' })
        return res.status(200).send({ success: true, message: 'Payment Card Updated' })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, message: 'Something went wrong' })
    }
}

module.exports = updatePaymentCard;