const TgBot = require('../bot');

function HandleKeyboardActions() {
    TgBot.hears('connect account', require('./connectAccount'));
    TgBot.hears('Referral Program', require('./referralProgram'));
    TgBot.hears('back', require('../commands/start'));
    TgBot.hears('Add Channel / Group', require('./addChannelsOrGroups'));

}

module.exports = HandleKeyboardActions;