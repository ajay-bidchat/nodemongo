const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

module.exports = sgMail;