const Database = require("../database/mongodb")
const db = new Database()
const crypto = require('crypto')
const generatePaymentCardId = require("../utils/genaretePaymentCardId")

async function AddPaymentCard(req, res) {
    try {
        const { name, upiId } = req.body
        const { _id } = req.user ?? {}

        if (!name || !upiId || !_id) {
            return res?.status(400).send({ success: false, message: 'Missing required fields' })
        }

        const { data: paymentCards = [] } = await db.getLogs({ userId: _id }, 'paymentCards')

        const id = generatePaymentCardId()
        if (paymentCards.length < 5) {
            await db.addLogs({ id, name, upiId, userId: _id, createdAt: new Date().getTime() }, 'paymentCards')
        } else {
            return res?.status(400).send({ success: false, message: 'Only 5 payment cards allowed' })
        }

        res.status(200).send({ success: true, message: 'Payment Card Added' })
    } catch (error) {
        console.error(error)
        res?.status(500)?.send({ success: false, message: 'Something went wrong' })
    }
}

module.exports = AddPaymentCard