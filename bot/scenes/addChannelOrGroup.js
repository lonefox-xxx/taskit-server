const { Scenes, Markup } = require('telegraf');
const Database = require('../../database/mongodb');
const db = new Database()

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

    addChannelsOrGroupsScene.on('text', async (ctx) => {
        const { message_id } = await ctx.reply('plz wait...')

        const reply = async (msg) => {
            await ctx.telegram.deleteMessage(ctx.chat.id, message_id)
                .then()
                .catch((e) => console.log(e))

            return await ctx.replyWithMarkdown(msg)
        }

        const { message: { forward_from_chat: forwardMMessage = null } } = ctx;

        if (!forwardMMessage) return reply('plz forward a message form the channel/group that you want add');

        ctx.telegram.getChatAdministrators(forwardMMessage.id).then(async (admins) => {
            const creator = admins.find(admin => admin.status == 'creator')
            const Bot = admins.find(admin => admin.user.id == ctx.botInfo.id)
            const { user: { id } } = creator
            const { can_post_messages = false, can_edit_messages = false, can_delete_messages = false } = Bot
            const chatUserId = ctx.chat.id

            if (chatUserId != id) return reply(`only the channel/group owners can add it, you are not the owner of @${forwardMMessage?.username || 'channel'}`);
            if (!can_post_messages || !can_edit_messages || !can_delete_messages) return reply(`Please grant the required permissions for the bot to work properly. They're essential 😊`);

            const { data: channelAndGroups = [] } = await db.getLogs({ channelOrGroupId: forwardMMessage.id }, 'associatedChannelsAndGroups')
            if (channelAndGroups?.length > 0) return reply(`channel or group already in use 🥺`)

            const [membersCount = 0, chatInfo] = await Promise.all([ctx.getChatMembersCount(forwardMMessage.id), ctx.telegram.getChat(forwardMMessage.id)])

            // if (membersCount < 100) return reply(`there should be at least 100 members in your channel/group to add it`)
            const { href = null } = await ctx.telegram.getFileLink(chatInfo.photo?.big_file_id || chatInfo.photo?.small_file_id)

            const { data: user = [] } = await db.getLogs({ tgId: ctx.chat?.id || null }, 'referralProgramUsers')
            if (user?.length <= 0) return reply(`you don't have an account in referral program or you don't connect it with this bot 😔`)
            const { _id } = user[0]

            const ChannelOrGroupData = {
                channelOrGroupId: forwardMMessage?.id || null,
                tgUserId: ctx.chat?.id || null,
                userId: _id,
                channelOrGroupMetadata: {
                    id: forwardMMessage?.id || null,
                    name: forwardMMessage?.title || forwardMMessage?.username || null,
                    username: forwardMMessage?.username || null,
                    chatPhoto: href || null,
                    admins,
                    totalMembers: membersCount
                },
                status: 0,
                type: 'partnerShip',
                createdAt: new Date().getTime(),
                lastUpdated: new Date().getTime(),
            }
            await db.addLogs(ChannelOrGroupData, 'associatedChannelsAndGroups')

            await reply(`your channel/group added successfully\n\nimportant:\n• By default your channel/group is in a inactive state,\n• Go to your [referral program](https://taskit-admin-client.vercel.app/referralprogram/dashboard?screen=myGroupsAndChannels) dashboard and connect your channel/group with a payment card to activate this to receive updates\n\nThank you for being a part of us\nand Best wishes for your earnings 😊`)

            await ctx.scene.leave();
            require('../keyboardActions/referralProgram')(ctx)

        }).catch(err => {
            if (err.message == '400: Bad Request: member list is inaccessible') {
                return reply(`plz make me an admin in your channel/group 😔`)
            }

            reply('something went wrong')
            console.log(err)
        })
    });

    const stage = new Scenes.Stage([addChannelsOrGroupsScene]);
    return stage
}

module.exports = AddChannelsOrGroupsSene;