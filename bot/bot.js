const { Telegraf } = require('telegraf');
// const TgBot = new Telegraf(process.env.TEST_BOT_TOKEN);
const TgBot = new Telegraf(process.env.BOT_TOKEN);


TgBot.launch(() => {
    require('./commands/commands')()
    require('./keyboardActions/keyboardActions')()
    console.log('bot is up and running')
})

module.exports = TgBot;
