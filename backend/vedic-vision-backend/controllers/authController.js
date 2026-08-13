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
module.exports = { loginController, registerController };