const express = require('express');
const router = express.Router();
const passport = require('../../config/passport');
const authControllerAPI = require('../../controllers/api/authControllerAPI');

router.post('/authenticate', authControllerAPI.authenticate);
router.post('/forgotpassword', authControllerAPI.forgotPassword);

module.exports = router;
