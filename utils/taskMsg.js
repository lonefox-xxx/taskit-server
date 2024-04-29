function TaskMsg({ id, name, maxLimit, paymentMethod, perUser, perRefer, taskLink = 'https://google.com', steps, flat = true }) {

    let header = `#task_time\n<b><i>${name}</i></b>`

    let paymentDetails;
    if (flat) { paymentDetails = `earn flat <b>${perUser} rs</b> per user and <b>${perRefer} rs</b> per referer to your ${paymentMethod}` }
    else { paymentDetails = `earn upto <b>${perUser} rs</b> per user and <b>${perRefer} rs</b> per referer to your ${paymentMethod}` }

    let stepsMsg = `steps\n •click the link\n •register for the task\n •get redirect to the task\n •complete the task as per steps\n •submit your proofs\n •done 🥳\n<a href="${'https://taskit-admin-client.vercel.app/steps/' + id}">see all steps</a>`
    let taskLinkMsg = `<a href="${taskLink}">click here to complete task</a>`
    let tail = `<blockquote>Hurry! Only <b>${maxLimit}</b> spots available. Don't miss out!.</blockquote>`

    const msg = header + '\n' + paymentDetails + '\n\n' + stepsMsg + '\n\n' + taskLinkMsg + '\n\n' + tail
    return msg
}

module.exports = TaskMsg;