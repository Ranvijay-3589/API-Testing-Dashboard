const express = require('express');
const requestController = require('../controllers/request.controller');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/send', auth, requestController.sendRequest);
router.get('/history', auth, requestController.getHistory);

module.exports = router;
