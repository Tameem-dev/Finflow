const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Store codes temporarily (in production, use Redis or a database)
const verificationCodes = new Map();

// Create email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send verification code endpoint
app.post("/api/send-code", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store code with expiration (5 minutes)
    verificationCodes.set(email, {
      code: code,
      expires: Date.now() + 5 * 60 * 1000,
    });

    // Send email
    // Send email
   const mailOptions = {
    from: {
        name: 'FinFlow',
        address: process.env.EMAIL_USER
    },
    to: email,
    subject: "Password Reset Code - FinFlow",
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #458FF6;">Password Reset Request</h2>
            <p>You requested to reset your password for your FinFlow account.</p>
            <p>Your verification code is:</p>
            <div style="background-color: #f0f4f8; padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
                <h1 style="color: #458FF6; font-size: 36px; letter-spacing: 5px; margin: 0;">${code}</h1>
            </div>
            <p>This code will expire in 5 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
            <p style="color: #6b7280; font-size: 12px;">FinFlow - Manage Your Finances</p>
        </div>
    `,
};

    await transporter.sendMail(mailOptions);

    console.log(`Code sent to ${email}: ${code}`); // For testing
    res.json({ success: true, message: "Verification code sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// Verify code endpoint
app.post("/api/verify-code", (req, res) => {
  try {
    const { email, code } = req.body;

    const stored = verificationCodes.get(email);

    if (!stored) {
      return res
        .status(400)
        .json({ success: false, message: "No code found for this email" });
    }

    if (Date.now() > stored.expires) {
      verificationCodes.delete(email);
      return res
        .status(400)
        .json({ success: false, message: "Code has expired" });
    }

    if (stored.code !== code) {
      return res.status(400).json({ success: false, message: "Invalid code" });
    }

    // Code is valid
    verificationCodes.delete(email);
    res.json({ success: true, message: "Code verified successfully" });
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📧 Email service ready with ${process.env.EMAIL_USER}`);
});
