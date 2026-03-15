const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Logged in user routes
router.use(authController.protect);
router.patch('/updateMe', authController.updateMe);
router.patch('/updateMyPassword', authController.updatePassword);

// Admin only routes
router.use(authController.restrictTo('admin'));

router.get('/users', authController.getAllUsers);
router.post('/create-user', authController.createUser);
router.patch('/users/:id/status', authController.updateUserStatus);

module.exports = router;
