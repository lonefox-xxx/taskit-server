const Database = require("../database/mongodb");
const db = new Database()

async function DeletePaymentCard(req, res) {
    try {
        const { id } = req.body
        const { _id } = req.user

        if (!id) return res.status(400).send({ success: false, message: 'Missing required fields' })

        const { deletedCount } = await db.clearLogs({ id, userId: _id }, 'paymentCards')
        if (deletedCount === 0) return res.status(404).send({ success: false, message: 'Payment Card Not Found' })
        return res.status(200).send({ success: true, message: 'Payment Card Deleted' })
    } catch (error) {
        console.log(error.message)
        return res.status(500).send({ success: false, message: 'Something went wrong' })

    }
}

module.exports = DeletePaymentCard;