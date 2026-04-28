import 'dotenv/config';
import transporter from '../config/emailConfig.js';

export const sendOrderConfirmationEmail = async (to, subject, html) => {
  if (!to || !subject || !html) {
    throw { statusCode: 400, message: "Email parameters missing" };
  }

  const mailOptions = {
    from: process.env.EMAIL_USER, 
    to,
    subject,
    html, 
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send order email:", error.message);
    throw { statusCode: 500, message: "Failed to send email" };
  }
};


export const sendInvitationEmail = async (to, role, token) => {
  if (!to || !role || !token) {
    throw { statusCode: 400, message: "Invitation parameters missing" };
  }

  const registerUrl = `${process.env.FRONTEND_URL}/signup?token=${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "You've been invited to join our team",
    html: `
      <div style="font-family: sans-serif; border: 1px solid #ddd; padding: 20px;">
        <h2>Welcome to the Platform!</h2>
        <p>You have been invited to join as a <strong>${role}</strong>.</p>
        <p>Please click the button below to complete your registration:</p>
        <a href="${registerUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Set Up My Account
        </a>
        <p style="margin-top: 15px; font-size: 12px; color: #777;">This link expires in 48 hours.</p>
      </div>
    `,
  };

try {
  await transporter.sendMail(mailOptions);
} catch (error) {
  console.error("--- FULL EMAIL ERROR ---");
  console.dir(error); 
  console.error("-------------------------");

  if (error.response) {
    console.error("SMTP Response:", error.response);
  }

  throw { statusCode: 500, message: `Failed to send email: ${error.message}` };
}

};
