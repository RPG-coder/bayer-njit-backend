var express = require('express');
var router = express.Router();
//var userController = require('./controller/users.controller');


/* Route: /users */
router.put('/users', function(req, res, next) {
  /* @route: /users
     @method: put
     @request: {userid,password} 
     @response: userData = {success: isLogged, userData: {userid, fullName, email, authToken}, message}
     @details:
     - GET /users is used to check if user exist and return userData as response.
     - Generates new uniquely identified auth-token for retaining it in user's cookie, to maintain a secure login state.
     - Updates database with user login=true and generating new auth-token (using uuid, for now)
   */
  const response = userController.login(req,res);
  res.send(response);
}); router.put('/users/login', function(req, res, next) {
  /* @route: /users/login
     @method: put
     @request: {userid,password}
     @response: userData = {success: isLogged, userData: {userid, fullName, email, authToken}, message}
     @details: Alternative to GET /users route
   */
  const response = userController.login(req,res);
  res.send(response);
});
router.post('/users', function(req, res, next) {
  /* @route: /users
     @method: post
     @request: {userid,password,fullname, email} 
     @response: userData = {success: isLogged, userData: {userid, fullName, email, authToken}, message}
     @details:
     - POST /users is used to create a new user with userid and responds with the login state immediately
     - Creates a record using request data along with a new auth-token, isLogged, createdAt and updatedAt
     - Generates new uniquely identified auth-token for retaining it in user's cookie, to maintain a secure login state.
     - Updates database with user login=true and generating new auth-token (using uuid, for now)
   */
  const response = userController.register(req,res);
  res.send(response);
});router.post('/users/register', function(req, res, next) {
  /* @route: /users/register
     @method: post
     @request: {userid,password,fullname, email} 
     @response: userData = {success: isLogged, userData: {userid, fullName, email, authToken}, message}
     @details: Alternative to POST /users
   */
  const response = userController.register(req,res);
  res.send(response);
});


/* ------------------------------------------------------------------------------- */

/* Route: /user/preferences */
router.get('/users/preferences', function(req, res, next) {
  /* @route: /users/preferences
     @method: get
     @request: {userid, authToken} 
     @response: userPreferences = {userid, preferenceData : [ userPref1: {preferenceId, savedName, jsonData}, userPref2, ... ] }
     @details:
     - GET /preferences
   */
  const response = userController.getPreferences(req);
  res.send(response);
});
router.post('/users/preferences', function(req, res, next) {
  /* @route: /users/preferences
     @method: post
     @request: {userid, authToken,  saveName, jsonData}
     @response: statusMessage = {success, message}
     @details:
     - POST /preferences is used to create a new preference belonging to user with userid
     - responds the success with message for the creation operation.
   */
  const response = userController.createPreferences(req);
  res.send(response);
});
router.put('/users/preferences', function(req, res, next) {
  /* @route: /users/preferences
     @method: put
     @request: {userid, authToken,  preferenceId, jsonData}
     @response: statusMessage = {success, message}
     @details:
     - POST /preferences is used to update an existing preference belonging to user with userid
     - responds the success with message for the update operation
   */
  const response = userController.updatePreferences(req);
  res.send(response);
});
router.delete('/users/preferences', function(req, res, next) {
  /* @route: /users/preferences
     @method: delete
     @request: {userid, authToken,  preferenceId}
     @response: statusMessage = {success, message}
     @details:
     - POST /preferences is used to delete an existing preference belonging to user with userid
     - responds the success with message for the delete operation
     - Note this is a soft (paranoid) delete operation
   */
  const response = userController.deletePreferences(req);
  res.send(response);
});


/* ------------------------------------------------------------------------------- */

/* Route: /user/history */
router.get('/users/history', function(req, res, next) {
  /* @route: /users/preferences
     @method: get
     @request: {userid, authToken} 
     @response: userPreferences = {userid, historyData : [ userHistory1: {historyId, createdOn, jsonData}, userHistory2, ... ] }
     @details:
     - GET /history gets set of historical records on a user's patientFinder data access
   */
  const response = userController.getPreferences(req);
  res.send(response);
});
router.post('/users/history', function(req, res, next) {
  /* @route: /users/history
     @method: post
     @request: {userid, authToken, jsonData}
     @response: statusMessage = {success, message}
     @details:
     - POST /history is used to record a new action about patientFinder data access to the history belonging to user with userid
     - Responds the success with message for the creation operation.
   */
  const response = userController.recordHistory(req);
  res.send(response);
});


module.exports = router;
