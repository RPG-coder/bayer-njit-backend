var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Patient Finder API' });
});

router.get('/users', function(req, res, next) {
  res.render('index', { title: 'Patient Finder User must log-in using PUT /users first<br>OR, Create a new user with POST /users' });
});

module.exports = router;
