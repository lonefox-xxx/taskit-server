const nodemailer = require('nodemailer');

const SERVICE_EMAIL = process.env.SERVICE_EMAIL
const SERVICE_EMAIL_PASSWORD = process.env.SERVICE_EMAIL_PASSWORD

async function sendTaskConfirmationCode(recipients, verificationCode) {

    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: SERVICE_EMAIL,
                pass: SERVICE_EMAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: SERVICE_EMAIL,
            to: recipients,
            subject: `Task Confirmation Verification code is ${verificationCode}`,
            text: `Task Confirmation Verification code is ${verificationCode}\n\nThank you.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error)
                console.log(error)
            } else {
                resolve({ success: true, message: 'Email sent successfully', info })
            }
        });
    })
}

module.exports = sendTaskConfirmationCode;