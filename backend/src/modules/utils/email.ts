import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "ca7408d5dee8c0", // From Mailtrap dashboard
    pass: "1fac2a6456ec1f"  // From Mailtrap dashboard
  }
});

export const sendActivationEmail = (email: string, token: string) => {
  const activationLink = `http://localhost:3001/activate?token=${token}`;
  console.log('Attempting to send to:', email);
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Activate Your Cinema Account',
    html: `
      <div>
        <h2>Welcome to Cinema Management System!</h2>
        <p>Please click the link below to activate your account:</p>
        <a href="${activationLink}">Activate Account</a>
        <p>Or copy this link to your browser: ${activationLink}</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions)
    .then(info => console.log('Email sent:', info.response))
    .catch(err => {
      console.error('Email error:', err);
      throw err; 
    });
};
