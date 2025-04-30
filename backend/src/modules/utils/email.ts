import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendActivationEmail = (email: string, token: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Activate Your Cinema Account',
    html: `<a href="http://localhost:3001/register?token=${token}">Click here to activate</a>`,
  };
  return transporter.sendMail(mailOptions);
};