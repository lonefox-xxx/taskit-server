const bcrypt = require('bcrypt');
const TgBot = require("../bot/bot");
const Database = require("../database/mongodb");
const db = new Database()

async function ConnectTelegram(req, res) {
    try {
        const { login, password, tgId } = req.body
        if (!login || !password || !tgId) return res.status(400).send({ success: false, message: 'Missing required fields' })

        const query = { $or: [{ username: login }, { email: login }] };
        const { data: userData = [] } = await db.getLogs(query, 'referralProgramUsers');
        if (userData.length !== 1) { return res.status(400).send({ success: false, message: userData.length === 0 ? 'No user found' : 'Multiple users found' }) }

        const { email: userEmail, username: userName, password: hashedPassword } = userData[0];
        if (!userEmail || !userName || !hashedPassword) {
            return res.status(400).send({ success: false, message: 'Invalid user' });
        }

        const passwordMatched = await bcrypt.compare(password, hashedPassword);
        if (!passwordMatched) {
            return res.status(400).send({ success: false, message: 'Incorrect password' });
        }

        await TgBot.telegram.getChatMember(tgId, tgId);

        await db.updateLog({ data: { tgId: +tgId }, id: { username: userName } }, 'referralProgramUsers', false);
        res.status(200).send({ success: true, message: 'connected successfully' });
    } catch (error) {
        console.log(error)
        if (error.message == '400: Bad Request: chat not found') return res.status(400).send({ success: false, message: 'Invalid Telegram ID' })
        res.status(500).send({ success: false, message: 'Something went wrong' });
    }
}

module.exports = ConnectTelegram;
