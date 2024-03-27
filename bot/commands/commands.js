const TgBot = require('../bot');

function HandleCommands() {
    TgBot.command('start', require('./start'))
    TgBot.command('help', require('./help'))
}

module.exports = HandleCommands;