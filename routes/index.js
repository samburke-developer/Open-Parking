const express = require('express');
const router = express.Router();
const genericController = require('../controllers/genericController');


router.get('/', genericController.renderHome);
router.post('/free', genericController.getFreeSpots);



module.exports = router;
