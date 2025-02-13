const mailer = require("nodemailer")

exports.sendEmail = ({ to, subject, text }) => new Promise((resolve, reject) => {
    const transport = mailer.createTransport({
        auth: {
            user: process.env.FROM_EMAIL,
            pass: process.env.FROM_PASS
        },
        service: "gmail"
    })

    transport.sendMail({
        to,
        subject,
        text,
        html: text
    }, (err) => {
        if (err) {
            reject("Unable To Send Email" + err.message)
        }
        resolve(true)
    })
})