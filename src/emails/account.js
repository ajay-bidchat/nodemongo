const sgMail = require('@sendgrid/mail');

const sendgridAPIKey = "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";
sgMail.setApiKey(sendgridAPIKey);

const msg = {
    to: 'ajkrgb@gmail.com',
    from: 'ajkrgb@gmail.com',
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail.send(msg).then((res) => {
    console.log(res)
});