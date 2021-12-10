var express = require('express');
var router = express.Router();
var pfController = require('../controllers/patientfinder.controller');
const {appLogger} = require('../logs/logger');

/* --- Home page Routes --- */
router.get('/', function(req, res, next) {
  /** @function: API Home page Routing */
  res.render('index', { title: 'Patient Finder API' });
});

router.get('/users', function(req, res, next) {
  /** @function: User page Routing */
  res.render('index', {
    title: 'Patient Finder', 
    message1: 'User must log-in using PUT /users first',
    message2: 'OR, Create a new user with POST /users'
  });
});

router.get('/population/overview', (req,res)=>{
  const route = '/population/overview';
  appLogger.info(`[RECEIVED]: Request ${JSON.stringify(req.get)} for ${route}`);
  pfController.getPopulationOverview(req).then((response)=>{
    appLogger.info(`[SENDING]: Response ${JSON.stringify(response)} for ${route}`);
    res.status(200).send(response);
  });
});

module.exports = router;
