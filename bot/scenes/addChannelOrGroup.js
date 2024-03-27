const { Scenes, Markup } = require('telegraf');
const TgBot = require('../bot');

function AddChannelsOrGroupsSene() {
    const addChannelsOrGroupsScene = new Scenes.BaseScene('addChannelsOrGroupsScene');

    addChannelsOrGroupsScene.enter((ctx) => {
        const { username } = ctx.botInfo
        const keyBoard = Markup.keyboard([
            ['cancel']
        ]).resize()

        ctx.reply(`Please add @${username} as an admin in your channel or group with these permissions\n\n • Post Messages\n • Edit Messages\n • Delete Messages\n\nthen, forward a message form the channel/group to me\n\nnote:\n • you must be the owner of the channel/group\n • cant add one channel/group more than once`, keyBoard)
    });

    addChannelsOrGroupsScene.hears('cancel', async (ctx) => {
        await ctx.reply('Cancelled adding channel/group')
        await ctx.scene.leave();
        require('../keyboardActions/referralProgram')(ctx)
    })

    addChannelsOrGroupsScene.on('text', (ctx) => {
        const { message: { forward_from_chat: forwardMMessage = null, chat = null } } = ctx;

        if (!forwardMMessage) return ctx.reply('plz forward a message form the channel/group that you want add');
        // console.log(forwardMMessage, chat)

        ctx.telegram.getChatAdministrators(forwardMMessage.id).then((admins) => {
            console.log(admins)
        }).catch(err => {
            if (err.message == '400: Bad Request: member list is inaccessible') {
                return ctx.reply(`seems like you don't even include me in your channel/group 🥺`)
            }
            console.log(err.message)
        })

        // ctx.reply("I'm just a simple bot and don't have an answer for that yet!");
    });

    const stage = new Scenes.Stage([addChannelsOrGroupsScene]);
    return stage
}

module.exports = AddChannelsOrGroupsSene;