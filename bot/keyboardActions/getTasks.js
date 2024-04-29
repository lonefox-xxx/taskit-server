const { Markup } = require("telegraf");

function GetTasks(ctx) {
    const inlineKeyboard = Markup.inlineKeyboard([
        Markup.button.url('join now', 'te.me/protaskit')
    ]);

    ctx.replyWithHTML('join <b>@protaskit</b> to get tasks on daily basis\nand exclusive benefits.', inlineKeyboard);
}

module.exports = GetTasks;