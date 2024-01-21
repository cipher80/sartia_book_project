const express = require('express');
const bookController = require('../controllers/bookController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/requestBook', authenticateToken, bookController.requestBook);


module.exports = router;
