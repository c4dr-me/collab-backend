require("dotenv").config();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const User = require("../models/Schema");

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const sendContactEmail = async (req, res) => {
  const { recipientEmail, senderEmail, message } = req.body;

  if (!recipientEmail || !senderEmail || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const accessToken = await oauth2Client.getAccessToken();
    if (!accessToken.token) {
      throw new Error('Failed to obtain access token');
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_ADDRESS,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: recipientEmail,
      subject: "Someone wants to contact you from COLLAB",
      text: `You have received a new message from Hire Me App!\n\nSender: ${senderEmail}\n\nMessage:\n${message}`,
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Someone wants to hire you from COLLAB!</h2>
        <p><strong>Sender:</strong> ${senderEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <p><strong>Contact them at:</strong> ${senderEmail} ASAP</p>
      </div>
      `,
    };

    console.log("Attempting to send email to:", recipientEmail);
    console.log("Access Token:", accessToken.token);
    console.log("Mail Options:", mailOptions);

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");

    // Add notification to the recipient's account
    const recipient = await User.findOne({ email: recipientEmail });
    if (recipient) {
      recipient.notifications.push({
        type: 'contact',
        senderEmail: senderEmail,
        message: `You have received a contact request from ${senderEmail}. Kindly check your mail.`
      });
      await recipient.save();
    }

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

module.exports = { sendContactEmail };
