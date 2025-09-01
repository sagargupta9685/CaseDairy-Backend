const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');
const addcaseController = require('../controllers/addcaseController');
const { protect } = require('../middleware/authMiddleware');

// Case routes
router.post('/', protect, caseController.addCase);
router.get('/user/:userId', protect, caseController.getCasesByUser);
router.put('/complete/:id', protect, caseController.markCaseComplete);

// Add case routes
// router.post('/add', protect, addcaseController.addCase);
// router.get('/user/:userId/all', protect, addcaseController.getAllCasesByUser);

// Hearing routes (inside cases)
router.post('/add-hearing', protect, caseController.addHearingDate);
router.get('/hearings/:caseId', protect, caseController.getHearingDatesByCase);

// Case details
router.get('/details/:id', protect, caseController.getCaseById);

module.exports = router;
