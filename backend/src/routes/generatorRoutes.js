const express = require('express');
const generatorController = require('../controllers/generatorController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.post('/generate', generatorController.generate);

module.exports = router;
