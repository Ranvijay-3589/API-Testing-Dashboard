const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const auth = require('../middleware/auth');

router.post('/send', auth, requestController.send);
router.get('/history', auth, requestController.history);

module.exports = router;
