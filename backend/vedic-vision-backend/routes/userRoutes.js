// userRoutes.js
const express = require('express');
const { loginController, registerController } = require('../controllers/authController');
const { sendEmail, updateCalories, yogaFetchData } = require('../controllers/yogaController');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const multer = require('multer')
const path = require('path');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/upload/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })

router.post('/login', loginController);
router.post('/register', registerController); // Use upload.single('photo') for file uploads

router.post('/sendotp', protect, sendEmail)
router.post('/updatecal', protect, updateCalories)
router.post('/fetchyogadata', protect, yogaFetchData)

module.exports = router;
