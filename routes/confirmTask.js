const Database = require("../database/mongodb");
const db = new Database();
const bcrypt = require('bcrypt');
const RedisClient = require("../database/redis");
const generateVerificationCode = require("../utils/generateVerificationCode");
const sendTaskConfirmationCode = require("../utils/sendTaskConfirmationCode");

async function ConfirmTask(req, res) {
    try {
        const { id = null, verificationCode = null } = req.body
        const { role = null, permissions = [] } = req.user;

        if (role !== 'admin' && role !== 'root') return res.status(400).send({ success: false, message: 'Unauthorized access' })
        if (!permissions.includes('Confirm Tasks') && role !== 'root') return res.status(400).send({ success: false, message: 'Insufficient privileges' });

        if (!id) return res.status(400).send({ success: false, message: 'No task found' })
        const { data: task } = await db.getLogs({ id: id }, 'tasks')
        if (!task || task.length <= 0 || task.length > 1) return res.status(400).send({ success: false, message: 'No task found' })

        if (task[0].confirmed) return res.status(400).send({ success: false, message: 'task already confirmed' })

        if (!verificationCode) {
            const lastRequestTimeStamp = await RedisClient.GET(`lastRequestTimeStamp:${id}`)
            if (lastRequestTimeStamp && (Date.now() - lastRequestTimeStamp) < 5 * 60 * 1000) return res.status(400).send({ success: false, message: 'You can only request for verification code once in 5 minutes' });

            const verificationCode = generateVerificationCode()
            const hashedVerificationCode = await bcrypt.hash(verificationCode.toString(), 10)
            await RedisClient.SETEX(`verificationCode:${id}`, 10 * 60, hashedVerificationCode)
            await RedisClient.SETEX(`verificationCodeRetryCount:${id}`, 5 * 60, '0')
            await RedisClient.SET(`lastRequestTimeStamp:${id}`, Date.now())

            let { data: admins = [] } = await db.getLogs({ role: { $in: ["admin", "root"] } }, 'users')
            recipients = admins.map(admin => admin.email)

            const { success } = await sendTaskConfirmationCode(recipients, verificationCode)
            if (!success) return res.status(400).send({ success: false, message: 'verification code sent failed' })

            return res.status(202).send({ success: true, message: 'verification code sent successfully' })
        }

        const hashedVerificationCodeFromRedis = await RedisClient.GET(`verificationCode:${id}`)
        if (!hashedVerificationCodeFromRedis) return res.status(400).send({ success: false, message: 'verification code expired' })
        const verificationCodeMatch = await bcrypt.compare(verificationCode.toString(), hashedVerificationCodeFromRedis)

        if (!verificationCodeMatch) {
            const retryCount = await RedisClient.GET(`verificationCodeRetryCount:${id}`)
            if (retryCount > 4) {
                await RedisClient.DEL(`verificationCodeRetryCount:${id}`)
                await RedisClient.DEL(`verificationCode:${id}`)
                return res.status(500).send({ success: false, message: 'retry limit reached , plz try again later' })
            }
            await RedisClient.INCR(`verificationCodeRetryCount:${id}`)
            return res.status(400).send({ success: false, message: 'Incorrect verification code' })
        }

        await RedisClient.DEL(`verificationCode:${id}`)
        await RedisClient.DEL(`verificationCodeRetryCount:${id}`)
        await db.updateLog({ id: { id: task[0].id }, data: { confirmed: true } }, 'tasks', false)
        return res.status(200).send({ success: true, message: 'task confirmed successfully' })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, message: 'something went wrong' })
    }
}

module.exports = ConfirmTask;