const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendSessionSummary = async ({ to, userName, pose, calories }) => {
    const mailOptions = {
        from: `"AI Yoga Assistant" <${process.env.EMAIL}>`,
        to,
        subject: `Your Yoga Session Summary, ${userName}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Your Yoga Session Summary</h2>
        <p>Great work, <strong>${userName}</strong>!</p>
        <p>You completed the <strong>${pose}</strong> pose.</p>
        <p style="font-size: 1.2em;">Calories burned: <strong>${parseFloat(calories).toFixed(2)} kcal</strong></p>
        <hr />
        <p style="color: #888; font-size: 0.9em;">AI Yoga Tutor — Stay consistent, stay healthy.</p>
      </div>
    `,
    };
    return transporter.sendMail(mailOptions);
};

const sendProgressSummary = async ({ to, userName, totalCalories }) => {
    const mailOptions = {
        from: `"AI Yoga Assistant" <${process.env.EMAIL}>`,
        to,
        subject: `Your Yoga Progress, ${userName}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Your Progress Update</h2>
        <p>Hello, <strong>${userName}</strong>!</p>
        <p>Total calories burned so far: <strong>${parseFloat(totalCalories).toFixed(2)} kcal</strong></p>
        <p>Keep up the great work!</p>
        <hr />
        <p style="color: #888; font-size: 0.9em;">AI Yoga Tutor</p>
      </div>
    `,
    };
    return transporter.sendMail(mailOptions);
};

module.exports = { sendSessionSummary, sendProgressSummary };
