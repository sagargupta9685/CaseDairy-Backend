const express = require('express');
const router = express.Router();
 const upload = require('../middleware/upload'); 
 
const addcaseController = require('../controllers/addcaseController');
// const authMiddleware = require('../middleware/authMiddleware'); // optional

const { protect } = require('../middleware/authMiddleware');
 
router.post('/add', protect, upload.array('documents', 5), addcaseController.addCase);
router.get('/user/:userId/all', protect, addcaseController.getAllCasesByUser);

// authMiddleware.protect
router.put('/update-status/:id', protect, addcaseController.updateCaseStatus);

 
 




module.exports = router;
