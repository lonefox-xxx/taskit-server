const TgBot = require("../bot/bot");
const TaskMsg = require("../utils/taskMsg");
const Database = require("../database/mongodb");
const db = new Database()
const { Markup } = require("telegraf");


async function PublishTask(req, res) {
    try {
        const { taskId } = req.body
        const { role = null, permissions = [] } = req.user;
        const MESSAGE_EDITOR_CHAT = process.env.MESSAGE_EDITOR_CHAT

        if (role !== 'admin' && role !== 'root') {
            return res.status(400).send({ success: false, message: 'Unauthorized access' });
        }
        if (!permissions.includes('Publish Tasks') && role !== 'root') {
            return res.status(400).send({ success: false, message: 'Insufficient privileges' });
        }

        let { data: task } = await db.getLogs({ id: taskId }, 'tasks')
        if (!task || task.length <= 0) return res.status(404).send({ success: false, message: 'Task not Found' })
        task = task[0]

        const taskValidToPublish = task.id && task.confirmed && !task.published && task.name && task.maxLimit && task.updaters && task.paymentMethod && task.perUser && task.perRefer && task.perTaskCompletion && task.steps && task.proofs

        if (taskValidToPublish) {
        // await db.updateLog({ id: { id: task.id }, data: { published: true } }, 'tasks', false)

            const inlineKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('Publish on main channels', `publishMain:${task.id}`)],
                [Markup.button.callback('Publish on sub channels', `publishSub:${task.id}`)]
            ]);
            const taskMsg = TaskMsg({ ...task, flat: true })
            await TgBot.telegram.sendMessage(MESSAGE_EDITOR_CHAT, taskMsg, { parse_mode: 'HTML', reply_markup: inlineKeyboard.reply_markup });

            TgBot.action(/publishMain:(.+)/, async ctx => {
                const encodedData = ctx.match[1];
                await TgBot.telegram.answerCbQuery(ctx.callbackQuery.id, 'successfully published on main channels')
            });

            TgBot.action(/publishSub:(.+)/, async ctx => {
                const encodedData = ctx.match[1];
                await TgBot.telegram.answerCbQuery(ctx.callbackQuery.id, 'successfully published on sub channels')
            });

            return res.status(200).send({ success: true, msg: 'Task Published' })
        } else {
            let msg;
            if (!task.confirmed) msg = 'task not confirmed'
            if (task.published) msg = 'task already published'
            else msg = 'task not valid for publish'
            return res.status(400).send({ success: false, msg })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({ success: false, msg: 'something went wrong' })
    }
}

module.exports = PublishTask;