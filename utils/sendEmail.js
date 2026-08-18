import nodemailer from 'nodemailer';

export const sendEmail = async (opt) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const emailTemplate = `
    <h1>Hi, ${opt.name || "User"} 👋</h1>
    <br />
    <h3>Reset Your Password</h3>
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <p><a href="${opt.resetURL}">Reset Password</a></p>
    <p>This link will expire in <strong>10 minutes</strong>.</p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Thank you for using our service.</p>
  `;

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: opt.email,
        subject: opt.subject || 'Reset Password',
        html: emailTemplate,
    };

    await transporter.sendMail(mailOptions);
};