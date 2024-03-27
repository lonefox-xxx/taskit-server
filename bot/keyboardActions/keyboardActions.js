const TgBot = require('../bot');

function HandleKeyboardActions() {
    TgBot.hears('connect account', require('./connectAccount'));
    TgBot.hears('Referral Program', require('./referralProgram'));
    TgBot.hears('Add Channel / Group', require('./addChannelsOrGroups'));
    TgBot.hears('back', require('../commands/start'));

}

module.exports = HandleKeyboardActions;