const { Markup } = require('telegraf');
const Database = require("../../database/mongodb");
const TgBot = require('../bot');
const db = new Database()

async function MyChannelsOrGroups(ctx) {
    try {
        const { message_id } = await ctx.replyWithHTML('plz wait...')

        const reply = async (msg, params = {}) => {
            await ctx.telegram.deleteMessage(ctx.chat.id, message_id)
                .catch(error => console.error(error))

            return await ctx.replyWithHTML(msg, params).catch(error => ctx.replyWithHTML('something went wrong, please try again.').catch(error => console.error(error)))
        }

        const { data: channelsAndGroups = [] } = await db.getLogs({ tgUserId: ctx.chat.id }, 'associatedChannelsAndGroups').catch(error => ctx.replyWithHTML('something went wrong, please try again.').catch(error => console.error(error)))
        if (channelsAndGroups.length <= 0) return reply(`You haven't added any channel or group yet`).catch(error => ctx.replyWithHTML('something went wrong, please try again.').catch(error => console.error(error)))

        const active = channelsAndGroups.filter(channelOrGroup => channelOrGroup.status === 1).length || 0
        const inactive = channelsAndGroups.filter(channelOrGroup => channelOrGroup.status === 0).length || 0

        const msg = `Your channels and groups:\n\n<b>Total Channels and Groups: ${channelsAndGroups.length}\nTotal Active: ${active}\nTotal Inactive: ${inactive}</b>\n\nimportant:\n• By default your channel/group is in a inactive state,\n• Go to your <a href="https://protaskit.vercel.app/referralprogram/dashboard?screen=myGroupsAndChannels">referral program</a> dashboard and connect your channel/group with a payment card to activate.`
        const inlineKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('Turn Off all', 'turn_off/on_channels_and_groups'), Markup.button.url('view/edit', 'https://protaskit.vercel.app/referralprogram/dashboard?screen=myGroupsAndChannels')],
        ])

        await reply(msg, { reply_markup: inlineKeyboard.reply_markup }).catch(error => ctx.replyWithHTML('something went wrong, please try again.').catch(error => console.error(error)))

        TgBot.action('turn_off/on_channels_and_groups', async (ctx) => {

        }).catch(error => ctx.replyWithHTML('something went wrong, please try again.').catch(error => console.error(error)))

    } catch (error) {
        return ctx.replyWithHTML('something went wrong, please try again.').catch(error => console.error(error))
    }
}

module.exports = MyChannelsOrGroups;
