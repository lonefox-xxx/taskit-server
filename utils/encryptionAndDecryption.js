const crypto = require('crypto');
const CHANNEL_TOKEN_PASSWORD = process.env.CHANNEL_TOKEN_PASSWORD

function EncryptData(data, password = null) {
    try {
        const finalPassword = password || CHANNEL_TOKEN_PASSWORD
        const iv = crypto.randomBytes(16);
        const key = crypto.scryptSync(finalPassword, 'salt', 32);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encryptedData = cipher.update(data, 'utf-8', 'hex');
        encryptedData += cipher.final('hex');
        return {
            iv: iv.toString('hex'),
            encryptedData: encryptedData
        };
    } catch (error) {
        console.log(error)
        return null
    }
}

function DecryptData(encryptedData, iv, password = null) {
    try {
        const finalPassword = password || CHANNEL_TOKEN_PASSWORD
        const key = crypto.scryptSync(finalPassword, 'salt', 32);
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
        let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
        decryptedData += decipher.final('utf-8');
        return decryptedData;
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports = { EncryptData, DecryptData };