var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/register", jsonParser, userController.createUser);
router.post("/login", jsonParser, userController.performAuthentication);
router.post("/logout", jsonParser, userController.logOut);

module.exports = router;
