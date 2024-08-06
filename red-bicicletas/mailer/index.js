const nodemailer = require('nodemailer');

const delay = ms => new Promise(res => setTimeout(res, ms)); // for delaying when not using a native async function
// Crear el transportador de Ethereal
const createTestAccount = async () => {
    // const testAccount = await nodemailer.createTestAccount();
    const testAccount = {
        // Name: Shany Koepp
        user: 'rod.feil34@ethereal.email',
        pass: 'ry1EbxXJhPRjj9mK1d',
    };

    await delay(1000);  // wait 1 second

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        }
    });
    
    return transporter;
};

// Función para enviar un correo
const sendEmail = async (to, subject, html) => {
    const transporter = await createTestAccount();

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
