const express = require('express');
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/addUser', authenticateToken, isAdmin, adminController.addUser);
router.put('/updateUser/:userId', authenticateToken, isAdmin, adminController.updateUser);
router.get('/getUser/:userId', authenticateToken, isAdmin, adminController.getUser);
router.post('/forgetPassword', authenticateToken, isAdmin, adminController.forgetPassword);
router.post('/resetPassword', authenticateToken, isAdmin, adminController.resetPassword);
router.delete('/deleteUser/:userId', authenticateToken, isAdmin, adminController.deleteUser);

module.exports = router;
