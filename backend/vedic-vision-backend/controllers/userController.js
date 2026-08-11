const express = require("express")
const expressAsyncHandler = require("express-async-handler")
const userModel = require('../models/userModel')
const nodemailer = require('nodemailer');
const generateToken = require("../config/createToken")
const Yoga = require("../models/yogaData")
const User = require("../models/userModel")
const dotenv = require("dotenv")
dotenv.config()
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use SSL
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  }
});

const loginController = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({
      $or: [{ email: email }, { userName: email }]
    });
    if (user && (await user.matchPassword(password))) {
      let yoga = await Yoga.findOne({ userId: user._id }).populate('userId');
      if (!yoga) {
        yoga = await Yoga.create({ userId: user._id });
        yoga.userId = user; // Set populated userId manually
      }

      return res.status(200).json({
        id: yoga._id,
        day: yoga.day || 1,
        calories: yoga.calories || 0,
        totalCalories: yoga.totalCalories || 0,
        userDetails: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          phone: user.phone,
          email: user.email,
        },
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).send("user not found");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const registerController = expressAsyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password, phone } = req.body;

    if (!userName || !email || !password || !lastName || !firstName) {
      return res.status(400).json({ message: "Fields are not filled" });
    }

    const userNameExist = await User.findOne({ userName });
    if (userNameExist) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = await User.create({ firstName, lastName, userName, email, password, phone });
    await Yoga.create({ userId: user._id });

    return res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: "Server error during registration" });
  }
})
function generateOTP(length = 6) {
  // Ensure the length is at least 1
  if (length < 1) {
    throw new Error('OTP length must be at least 1');
  }

  // Generate a random OTP by creating a random number and padding it
  const otp = Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
  return otp;
}
const updateCalories = expressAsyncHandler(async (req, res) => {
  try {
    const { score, pose } = req.body;
    const userId = req.user._id;
    const email = req.user.email;
    const userName = `${req.user.firstName} ${req.user.lastName}`;

    const prevyoga = await Yoga.findOne({ userId });
    const total = Number(prevyoga.totalCalories || 0) + Number(score);

    const updatedYoga = await Yoga.findOneAndUpdate(
      { userId },
      {
        $set: {
          calories: score,
          totalCalories: total
        },
        $inc: { sessionCount: 1 }
      },
      { new: true }
    );

    const { sendSessionSummary } = require('../services/emailService');
    await sendSessionSummary({ to: email, userName, pose, calories: score });

    return res.status(200).json({ message: "Calories updated and email sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to update calories" });
  }
});
const sendEmail = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const email = req.user.email;
    const userName = `${req.user.firstName} ${req.user.lastName}`;

    const yogadata = await Yoga.findOne({ userId });

    const { sendProgressSummary } = require('../services/emailService');
    await sendProgressSummary({ to: email, userName, totalCalories: yogadata?.totalCalories || 0 });

    return res.status(200).json({ message: "Progress email sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to send progress email" });
  }
});
const yogaFetchData = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const yogaData = await Yoga.findOne({ userId })
    return res.status(200).json({
      totalCalories: yogaData.totalCalories,
      lastyoga: yogaData.calories
    })
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Failed to fetch yoga data" });
  }
})
module.exports = { loginController, registerController, sendEmail, updateCalories, yogaFetchData }