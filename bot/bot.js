const { Telegraf, session } = require('telegraf');
const TgBot = new Telegraf(process.env.BOT_TOKEN);

let AddChannelsOrGroupsSene = require('./scenes/addChannelOrGroup');

AddChannelsOrGroupsSene = AddChannelsOrGroupsSene()
TgBot.use(session());
TgBot.use(AddChannelsOrGroupsSene.middleware())

TgBot.launch(() => {
    require('./commands/commands')()
    require('./keyboardActions/keyboardActions')()
    console.log('bot is up and running')
})

module.exports = TgBot;
