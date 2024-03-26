const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

function setupBot() {

    // Set up your bot commands, handlers, etc.
    bot.command('start', (ctx) => {
        ctx.reply('Hello! Welcome to my bot.');
    });

    bot.on('text', (ctx) => {
        // Handle incoming messages
    });

    return bot;
}

module.exports = setupBot;
