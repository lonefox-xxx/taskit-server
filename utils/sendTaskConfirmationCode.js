const nodemailer = require('nodemailer');

async function sendTaskConfirmationCode(recipients, verificationCode) {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'your_email@gmail.com',
                pass: 'your_password'
            }
        });

        let mailOptions = {
            from: 'your_email@gmail.com',
            to: recipients,
            subject: `Task Confirmation Verification code is ${verificationCode}`,
            text: `Task Confirmation Verification code is ${verificationCode}\n\nThank you.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error)
            } else {
                resolve({ success: true, message: 'Email sent successfully', info })
            }
        });
    })
}

module.exports = sendTaskConfirmationCode;