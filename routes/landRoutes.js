const express = require('express');
const router = express.Router();
const landController = require('../controllers/landController');
const multer = require('multer');

 

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Land APIs
router.post('/add', upload.array('files'), landController.addLandRecord);
 
// Location APIs
router.get('/states', landController.getStates);
router.get('/districts/:stateId', landController.getDistricts);
router.get('/tehsils/:districtId', landController.getTehsils);
router.get('/rural-urban/:tehsilId', landController.getRuralUrbanAreas);
router.get('/all', landController.getLandRecords); // Get all land records for a user
// router.get('/all/:userId', landController.getLandRecords);


module.exports = router;
