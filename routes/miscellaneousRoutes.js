const express = require('express');
const router = express.Router();
const addMiscellaneousRecord = require('../controllers/addmiscellaneousController');
 
 const upload = require('../middleware/upload');
 
 const { protect } = require('../middleware/authMiddleware');
  
 router.post('/add', protect, upload.array('documents', 5), addMiscellaneousRecord.addRecords);
  router.get('/records', protect, upload.array('documents', 5), addMiscellaneousRecord.getAllMiscellaneousRecord);

 module.exports = router;