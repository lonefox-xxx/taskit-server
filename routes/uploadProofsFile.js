const crypto = require('crypto');
const path = require('path');
const FireBaseAdmin = require('../database/firebase')

function UploadProofsFile(req, res) {
    try {
        const file = req.file;
        const { taskId } = req.body
        const file_unique_id = crypto.randomBytes(16).toString('hex');
        const fileExtension = path.extname(file.originalname);

        if (!file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        if (!taskId) {
            return res.status(400).json({ success: false, message: 'No task id provided' });
        }

        if (!file.mimetype.match(/^image\//)) return res.status(400).json({ success: false, message: 'plz provide an image' });


        const bucket = FireBaseAdmin.storage().bucket();
        const filename = taskId + '_' + file_unique_id + fileExtension;
        const filesPath = `userProofs/${taskId}/${filename}`
        const fileUpload = bucket.file(filesPath);

        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        stream.on('error', (error) => {
            console.error(error);
            res.status(500).json({ error: 'Failed to upload file' });
        });

        stream.on('finish', async (e) => {
            const url = await fileUpload.getSignedUrl({
                action: 'read',
                expires: '03-09-2491'
            })
            res.status(200).send({ success: true, message: 'success', url: url[0] })
        });
        stream.end(file.buffer);
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "something went wrong" })
    }
}

module.exports = UploadProofsFile;