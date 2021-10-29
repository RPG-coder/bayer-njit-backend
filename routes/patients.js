var express = require('express');
var router = express.Router();
var patientController = require('../controllers/patients')


router.post("/labels", jsonParser, patientController.fetchLabels);
router.post("/view-treatment", jsonParser, patientController.fetchViewTreatment);
router.post("/view-medical", jsonParser, patientController.fetchViewMedical);

module.exports = router;