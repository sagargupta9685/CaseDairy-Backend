const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const addcaseController = require('../controllers/addcaseController');
// const authMiddleware = require('../middleware/authMiddleware'); // optional

const { protect } = require('../middleware/authMiddleware');
router.post('/', protect,caseController.addCase); // authMiddleware.protect
router.get('/:userId', protect,caseController.getCasesByUser); // authMiddleware.protect
// routes/caseRoutes.js or similar
router.put('/complete/:id', protect,caseController.markCaseComplete);
router.post('/add', protect, addcaseController.addCase);
router.get('/:userId', protect,addcaseController.getAllCasesByUser); // authMiddleware.protect
router.post('/add-hearing', protect,caseController.addHearingDate);
// router.get('/:caseId',  protect,caseController.getHearingDatesByCase);
// router.get('/:id', protect,caseController.getCaseById);

// Unique, clear routes
 
router.get('/hearings/:caseId', protect, caseController.getHearingDatesByCase);
router.get('/details/:id', protect, caseController.getCaseById); // <- ✅ update route






module.exports = router;
