const express = require('express');
const {
  registerManager,
  login,
  logout,
} = require('../controllers/authController');
const  { adminLogin,adminRegister } = require('../controllers/adminAuthController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// router.post('/manager/register', registerManager);
// router.post('/login', login);
router.post('/logout', authenticate, logout);
router.post('/admin/login', adminLogin);
router.post('/admin/reg', adminRegister);



module.exports = router;

