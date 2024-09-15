import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * Creates a nodemailer transporter object for sending emails using Gmail service.
 * @param {Object} config - Configuration object for creating the transporter.
 * @param {string} config.service - The email service to use (e.g., "gmail").
 * @param {Object} config.auth - Authentication object containing user and pass.
 * @param {string} config.auth.user - The email address of the sender.
 * @param {string} config.auth.pass - The password of the sender's email account.
 * @returns A nodemailer transporter object for sending emails.
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email using the configured transporter with the provided details.
 * @param {string} to - The email address of the recipient.
 * @param {string} subject - The subject of the email.
 * @param {string} text - The text content of the email.
 * @returns A Promise that resolves when the email is sent.
 */
export const sendEmail = (to, subject, text) => {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};
