
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config()
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function mailingHelper(recipient, verificationToken) {
    const verificationLink = `${process.env.BASE_URL}/auth/verify/${verificationToken}`;

    return sgMail.send({
      to: recipient,
      from: process.env.SENDER_EMAIL,
      subject: "Please verify your email",
      html: `
      <h2>In order to verify your account please follow provided link</h2>
      <a href=${verificationLink}>${verificationLink}</a>
      `,
    });
  }
