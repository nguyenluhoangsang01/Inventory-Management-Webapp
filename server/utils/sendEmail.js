import nodemailer from "nodemailer";

const sendEmail = async ({ subject, message, sendTo }) => {
  // Create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE, // true for 465, false for other ports
    auth: {
      type: "OAuth2", // default
      user: process.env.MAIL_USERNAME, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
      clientId: process.env.OAUTH_CLIENTID, // generated ethereal password
      clientSecret: process.env.OAUTH_CLIENT_SECRET, // generated ethereal password
      refreshToken: process.env.OAUTH_REFRESH_TOKEN, // generated ethereal password
    },
  });

  // Send mail with defined transport object
  const mailOptions = {
    subject, // Subject line
    html: message, // html body
    from: process.env.MAIL_USERNAME, // sender address
    to: sendTo, // list of receivers
  };

  // Send email
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(err); // Log error
    } else {
      console.log(data); // Log success
    }
  });
};

export default sendEmail;
