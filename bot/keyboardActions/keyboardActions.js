const TgBot = require('../bot');

function HandleKeyboardActions() {
    TgBot.hears('connect account', require('./connectAccount'));
    TgBot.hears('Referral Program', require('./referralProgram'));
    TgBot.hears('Add Channel / Group', require('./addChannelsOrGroups'));
    TgBot.hears('My channels / groups', require('./myChannelsOrGroups'));
    TgBot.hears('Get Tasks', require('./getTasks'));
    TgBot.hears('back', require('../commands/start'));

}

module.exports = HandleKeyboardActions;