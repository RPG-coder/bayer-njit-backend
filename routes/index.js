var express = require('express');
var router = express.Router();

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

module.exports = router;
