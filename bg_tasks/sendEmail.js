import nodemailer from "nodemailer";
import "dotenv/config";
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});
export const sendErrorEmail = async (e) => {
  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to: [
      "rohit2khairmode2024@gmail.com",
      "karansignup5599@gmail.com",
      //"chinmaypisal45@gmail.com",
    ],
    subject: "Error in background tasks",
    text: `Error in background tasks ${e}`,
  };
  await transporter.sendMail(mailOptions);
};
