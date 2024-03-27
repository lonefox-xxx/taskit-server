const { Markup } = require("telegraf");

async function AddChannelsOrGroups(ctx) {
    ctx.scene.enter('addChannelsOrGroupsScene')
}

module.exports = AddChannelsOrGroups;