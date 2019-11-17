const express = require('express');

const handCtrl = require('../controllers/handCtrl');

const router = express.Router();

router.post('/hand', handCtrl.createHand);
router.get('/hand/:id', handCtrl.getHandById);
router.get('/hands', handCtrl.getHands);

module.exports = router;