const { Markup } = require("telegraf");


async function referralProgram(ctx) {

    const keyboard = Markup.keyboard([
        ['My channels / groups', 'Add Channel / Group'],
        ['back']
    ]).resize()

    ctx.reply('referral program', keyboard);
}

module.exports = referralProgram;