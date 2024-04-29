const { Markup } = require("telegraf");

async function ConnectAccount(ctx) {
    const { chat: { id, first_name, type, username }, chat } = ctx
    // console.log(chat, id, first_name, type, username)

    const inlineKeyboard = Markup.inlineKeyboard([
        Markup.button.webApp('Connect Now', `https://protaskit.vercel.app/connectTelegram?tgid=${id}`)
    ]);

    ctx.reply('connect your referral program account with your telegram account to perform various actions.', inlineKeyboard);
}

module.exports = ConnectAccount;