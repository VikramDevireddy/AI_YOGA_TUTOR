const expressAsyncHandler = require("express-async-handler");
const Yoga = require("../models/yogaData");


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
module.exports = { updateCalories, sendEmail, yogaFetchData };