const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.get('/stats', dashboardController.getStats);

module.exports = router;
