const { Markup } = require("telegraf");

function Start(ctx) {
    // console.log(ctx.update.message)
    const keyboard = Markup.keyboard([
        ['Get Tasks', 'Referral Program'],
        ['connect account']
    ]).resize()

    ctx.reply(`Hello😊, I'm TaskBee, the manager and task distributor for @protaskit.\nHow can I assist you today?`, keyboard);
}

module.exports = Start;