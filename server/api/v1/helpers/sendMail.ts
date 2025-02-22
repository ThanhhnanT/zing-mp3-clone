import * as nodemailer from 'nodemailer'

export const sendMail =(userMail, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS
        }
      });
      
      const mailOptions = {
        from: process.env.EMAIL,
        to: userMail,
        subject: subject,
        html: text
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
       console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          // do something useful
        }
      });
}