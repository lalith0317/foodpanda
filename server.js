const nodemailer = require('nodemailer');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Function to generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ✅ Configure Nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Your Gmail
    pass: process.env.EMAIL_PASS   // Your Gmail App Password
  }
});

// ✅ Endpoint to send OTP via email
app.post('/send-otp', (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).send({ success: false, message: 'Email is required' });
  }

  const otp = generateOTP(); // Generate a random OTP

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your FoodPanda OTP',
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('❌ Email error:', error);
      return res.status(500).send({ success: false, message: 'Failed to send OTP' });
    }

    console.log(`✅ OTP ${otp} sent to ${email}`);
    // In real apps, store the OTP in DB or cache with expiry
    res.send({ success: true, otp: otp }); // For demo: sending OTP in response
  });
});

// ✅ Start server
app.listen(3000, () => {
  console.log('✅ Backend server running on http://localhost:3000');
});
