// userRoutes.js
const express = require('express');
const { loginController, registerController,sendEmail,updateCalories, yogaFetchData } = require('../controllers/userController');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const multer  = require('multer')
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
router.post('/sendotp',sendEmail)
router.post('/updatecal',updateCalories)
router.post('/fetchyogadata',yogaFetchData)
router.post('/register', registerController); // Use upload.single('photo') for file uploads
module.exports = router;
