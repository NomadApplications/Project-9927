const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'project9927@gmail.com',
        pass: 'ohiuhTZyh4vnpBUS'
    }
});;

function sendMail(_mail){
    const mail = {
        from: '"Project 9927" <project9927@gmail.com>',
        to: _mail.to || null,
        subject: _mail.subject || "No subject",
        text: _mail.text || "No text"
    };

    if(mail.to === null) return;
    transporter.sendMail(mail, function(err, info){
        if(err)
            console.error(err);
    });
}

module.exports = { sendMail };