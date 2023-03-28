/*  
*   @author   : cherki hamza
*   @website  : https://hamzacherki.com
*   @desc     : this is the send email module
*/

const nodemailer = require('nodemailer');

const sendEmail =async (options) => { 
    // 1)- Create transporter object (service that sends emails like 'gmail','mailgun','maltrap','sendGrid)
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true, // true for 465, false for other ports 587
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },

    });
    // 2)- define email options (like: from,email,to,subject,content)
     let mailOptions = {
        from: 'E-shop App <cherkihamzafullstack@gmail.com>', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
        html: options.html, // html body
    };
    // 3)- send mail with defined transport object
    await transporter.sendMail(mailOptions);
 
};

module.exports = sendEmail;