async function AddChannelsOrGroups(ctx) {

    const { username } = ctx.botInfo

    ctx.reply(`Please add @${username} as an admin in your channel or group with these permissions\n\n • Post Messages\n • Edit Messages\n • Delete Messages\n\nthen, forward a message form the channel/group to me\n\nnote:\n • you must be the owner of the channel/group\n • cant add one channel/group more than once`,);
}

module.exports = AddChannelsOrGroups;