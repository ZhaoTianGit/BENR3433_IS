const express = require('express');
const router = express.Router();
const {User, Visit} = require('../model/user');
const admin = require('../controllers/admin');

router.get('/visits', admin.readVisitsData);
router.post('/registerHost', admin.registerHost);

module.exports = router;