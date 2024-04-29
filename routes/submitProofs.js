const Database = require("../database/mongodb");
const db = new Database();
const validator = require('validator');
const phone = require('phone');
const ValidateTaskToken = require("../utils/validateTaksToken");

async function SubmitProofs(req, res) {
    try {
        const { taskId, taskToken, proofs: submittedProofs } = req.body;
        if (!taskId || !submittedProofs) return res.status(400).send({ success: false, message: "Missing required fields" });
        if (!taskToken) return res.status(400).send({ success: false, message: "invalid task token" });

        const { verified, data: tokenData } = ValidateTaskToken(taskToken)
        if (!verified) return res.status(400).send({ success: false, message: "invalid task token" })

        console.log(tokenData)

        const { data: tasks } = await db.getLogs({ id: taskId }, 'tasks');
        if (!tasks || tasks.length === 0) return res.status(400).send({ success: false, message: "Task not Found" });
        const task = tasks[0];

        const { status = null, proofs = [] } = task;
        if (status == 'completed') return res.status(400).send({ success: false, message: "Task limit exceeded" });
        if (task.status != 'published') return res.status(400).send({ success: false, message: "Task not Found" })

        for (const proof of proofs) {
            const { id, type } = proof;
            const selectedSubmittedProof = submittedProofs?.[id] || null;
            if (!selectedSubmittedProof) return res.status(400).send({ success: false, message: "Please submit all the proofs" });

            switch (type) {
                case 'screenshot':
                case 'file':
                    if (!validator.isURL(selectedSubmittedProof)) return res.status(400).send({ success: false, message: "Invalid proofs submitted" });
                    break;
                case 'text':
                    if (!validator.isAlpha(selectedSubmittedProof)) return res.status(400).send({ success: false, message: "Invalid proofs submitted" });
                    break;
                case 'number':
                    if (!validator.isNumeric(selectedSubmittedProof)) return res.status(400).send({ success: false, message: "Invalid proofs submitted" });
                    break;
                case 'email':
                    if (!validator.isEmail(selectedSubmittedProof)) return res.status(400).send({ success: false, message: "Invalid proofs submitted" });
                    break;
                case 'phone':
                    const { isValid, phoneNumber: number } = phone(selectedSubmittedProof);
                    if (!isValid) return res.status(400).send({ success: false, message: "Invalid proofs submitted" });
                    break;
            }
        }
        await db.addLogs({ taskId, proofs: submittedProofs, userDta: tokenData }, 'submittedProofs');
        res.status(200).send({ success: true, message: "Proofs submitted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "something went wrong" });
    }
}

module.exports = SubmitProofs;
