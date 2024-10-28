const nodemailer = require('nodemailer');
const sgTrasnsport = require('nodemailer-sendgrid-transport');

let mailConfig;
if (process.env.NODE_ENV === 'production') {
    const options = {
        auth: {
            api_key: process.env.SENDGRID_API_SECRET,
        }
    }
    mailConfig = sgTrasnsport(options);
}
else if (process.env.NODE_ENV === 'staging') {
    console.log('XXXXXXXXXXXXXXXXXX');
    const options = {
        auth: {
            api_key: process.env.SENDGRID_API_SECRET,
        }
    }
    mailConfig = sgTrasnsport(options);
}
else {  // development: ethereal.email
    // const testAccount = await nodemailer.createTestAccount();
    // Lo ideal para una cuenta de nodemailer es que cada desarrollador tenga su propio nodemailer
    // Esto se logra extrayendo el user y pass del ambiente,
    // process.env.ethereal_user, process.env.ethereal_pwd
    const testAccount = {
        // Name: Shany Koepp
        user: process.env.ethereal_user,
        pass: process.env.ethereal_pwd,
    };

    mailConfig = {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,  // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        }
    }
}

const delay = ms => new Promise(res => setTimeout(res, ms)); // for delaying when not using a native async function

// Crear el transportador
const createTestAccount = async (mailConfig) => {
    await delay(1000);  // wait 1 second

    // create reusable transporter object using the default SMTP transport
    return nodemailer.createTransport(mailConfig);
};

// Función para enviar un correo
const sendEmail = async (to, subject, html) => {
    const transporter = await createTestAccount(mailConfig);

    // console.log('Transporter:', transporter);
    console.log('Transporter.options.auth.user:', transporter.options.auth.user);

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: `"Example Sender" <${transporter.options.auth.user}>`, // sender address
        to, // list of receivers
        subject, // Subject line
        html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

module.exports = { sendEmail };
