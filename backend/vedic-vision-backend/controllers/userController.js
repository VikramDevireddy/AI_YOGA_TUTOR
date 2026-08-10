const express=require("express")
const expressAsyncHandler=require("express-async-handler")
const userModel=require('../models/userModel')
const nodemailer = require('nodemailer');
const generateToken=require("../config/createToken")
const Yoga = require("../models/yogaData")
const User = require("../models/userModel")
const dotenv=require("dotenv")
dotenv.config()
const transporter = nodemailer.createTransport({
  service:'gmail',
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
      $or: [{ email:email }, { userName:email }]
    });
    if (user && (await user.matchPassword(password))) {
      const yoga = await Yoga.findOne({ userId: user._id }).populate('userId');

      return res.status(200).json({
        id: yoga._id,
        day: yoga.day,
        calories: yoga.calories,
        totalCalories:yoga.totalCalories,
        userDetails: {
          id: yoga.userId._id,
          firstName: yoga.userId.firstName,
          lastName: yoga.userId.lastName,
          userName: yoga.userId.userName,
          phone:yoga.userId.phone,
          email:yoga.userId.email,

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

const registerController=expressAsyncHandler( async (req,res)=>{
    const {firstName,lastName,email,password,userName,phone}=req.body;
    let user;
    if(!userName || !email || !password || !lastName || !firstName)
    { 
        res.send(400)

        // throw error("fields are not filled ")
    }
    const userexist=await userModel.findOne({email})
    if(userexist){
       res.status(401)
        res.send("email already exist")
    }
    const username=await userModel.findOne({userName})
    if(username){
       res.status(401)
        res.send("username already exist")
    }
    if(!userexist && !username)
   {
    user= await userModel.create({firstName,lastName,userName,email,password,phone })
    const yogaEntry = await Yoga.create({
      userId: user._id
  });
   }
   else{
    res.status(400)
    res.send("not created")
   }
    if(user){
        res.status(201).json({message:"register successsfull"})
    }
    else{
        res.status(400)
        throw new Error("registration error")
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
const updateCalories=expressAsyncHandler( async (req,res)=>{
  try {
    const {score,email,userName,userId,pose}=req.body;
    const CALORIES_PER_MINUTE = 5; 
    const prevyoga = await Yoga.findOne(
      { userId })
      const total=Number(prevyoga.totalCalories)+Number(score)
    const updatedYoga = await Yoga.findOneAndUpdate(
      { userId },
      { $set: { calories:score,
        totalCalories:total
       } }, // Update the calories field
      { new: true } // Return the updated document
    );
    
    const transporter = nodemailer.createTransport({
      service:'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // use SSL
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      }
    });

     
    console.log(email)
    const otp =generateOTP(6)
    const yogadata=await Yoga.findOne({userId})
    console.log(yogadata)
    const mailOptions = {
      from: process.env.email,
      to: email,
      subject: 'Your Daily Task Summary',
  text: `Hi ${userName},\n\nThank you for using our service.\n\nYou completed your tasks today and burned ${yogadata?.calories || '0'} calories.`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
        }
        .container {
          padding: 20px;
        }
        .header {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .otp-code {
          font-size: 24px;
          font-weight: bold;
        }
        .footer {
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <p class="header">Hi ${userName?userName:"User"},</p>
        <p>Thank you for using our service.</p>
        <p>You completed your tasks today and burned <b> ${yogadata?.calories.substr(0,4) || '0'} calories on pose <b>${pose}</b>.</b></p>
        <p>Keep up the great work!</p>
        <div class="footer">
          <p>Best regards,<br>Your Team DECODERZ</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
   await transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log('Error', error);
        return res.status(400).json({message:"email  ssend failed"})
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({message:"email send"})
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(400);
  }
})
const sendEmail=expressAsyncHandler( async (req,res)=>{
  try {
    const {email,userName,userId}=req.body;


    const transporter = nodemailer.createTransport({
      service:'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // use SSL
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      }
    });

     
    console.log(email)
    const otp =generateOTP(6)
    const yogadata=await Yoga.findOne({userId})
    console.log(yogadata)
    const mailOptions = {
      from: process.env.email,
      to: email,
      subject: 'Your Daily Task Summary',
  text: `Hi ${userName},\n\nThank you for using our service.\n\nYou completed your tasks today and burned ${yogadata?.calories || '0'} calories.`,
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
        }
        .container {
          padding: 20px;
        }
        .header {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .otp-code {
          font-size: 24px;
          font-weight: bold;
        }
        .footer {
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <p class="header">Hi ${userName?userName:"User"},</p>
        <p>Thank you for using our service.</p>
        <p>You completed your tasks today and burned <b> ${yogadata?.calories || '0'} calories.</b></p>
        <p>Keep up the great work!</p>
        <div class="footer">
          <p>Best regards,<br>Your Team DECODERZ</p>
        </div>
      </div>
    </body>
    </html>
  `,
};
   await transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log('Error', error);
        return res.status(400).json({message:"email  ssend failed"})
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({message:"email send"})
      }
    })
  } catch (error) {
    return res.send(error)
    console.log(error)
  }
})
const yogaFetchData=expressAsyncHandler( async (req,res)=>{
  try {
    const {userId}=req.body
    const yogaData=await Yoga.findOne({userId})
    return res.status(200).json({
      totalCalories:yogaData.totalCalories,
      lastyoga:yogaData.calories
    })
  } catch (error) {
    console.log(error)
    return res.status(400)
  }
})
module.exports={loginController,registerController,sendEmail,updateCalories,yogaFetchData}