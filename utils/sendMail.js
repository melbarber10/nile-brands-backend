import nodemailer from "nodemailer";

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };
  await transporter.sendMail(emailOptions);
};

export default sendMail;
