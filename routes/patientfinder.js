var express = require('express');
var router = express.Router();
var pfController = require('../controllers/patientfinder.controller');


/* --- Route: /patientfinder (via. app.use('/patientfinder'))--- */
/* --- 1. Routes: For Getters for Filter values --- */
router.post('/labels', (req,res,next)=>{
    /**
     * @route /patientfinder/labels
     * @method get
     * @param {JSON} req - request message of format {userid, authToken}
     * @param {JSON} res - response message for which the function generates format, {status, success=1, labelData} or {status, success=0, message, error}
     * @return {void} Nothing is returned, but the response message sent to the client
     */
    pfController.getLabels(req).then((response)=>{
        console.log(`Sending response ${JSON.stringify(response)} for /labels`);
        res.status(response.status).send(response);
    });
});
router.get('/values/paytyp', (req,res,next)=>{
    /**
     * @route /patientfinder/values/paytyp
     * @method get
     * @param {JSON} req - request message of format {userid, authToken}
     * @param {JSON} res - response message for which the function generates format, {status, success=1, paytypData} or {status, success=0, message, error}
     * @return {void} Nothing is returned, but the response message sent to the client
     */
    pfController.getPaytype(req).then((response)=>{
        console.log(`Sending response ${JSON.stringify(response)} for /paytyp`);
        res.status(response.status).send(response);
    });
});
router.get('/values/states', (req,res,next)=>{
    /**
     * @route /patientfinder/values/states
     * @method get
     * @param {JSON} req - request message of format {userid, authToken}
     * @param {JSON} res - response message for which the function generates format, {status, success=1, statesData} or {status, success=0, message, error}
     * @return {void} Nothing is returned, but the response message sent to the client
     */
    pfController.getStates(req).then((response)=>{
        console.log(`Sending response ${JSON.stringify(response)} for /states`);
        res.status(response.status).send(response);
    });
});
router.get('/values/cohort', (req,res,next)=>{
    /**
     * @route /patientfinder/values/cohort
     * @method get
     * @param {JSON} req - request message of format {userid, authToken}
     * @param {JSON} res - response message for which the function generates format, {status, success=1, cohortData} or {status, success=0, message, error}
     * @return {void} Nothing is returned, but the response message sent to the client
     */
    pfController.getCohort(req).then((response)=>{
        console.log(`Sending response ${JSON.stringify(response)} for /cohort`);
        res.status(response.status).send(response);
    });
});

/* ---------------------------------------------------------------------------------- */
/* --- 2. Routes: for Bar Graph generation --- */

router.post('/treatments', (req, res, next)=>{
  /**
   * Generate the PatientFinder data required for data visualization (graph) purpose. For treatments only.
   * jsonData contains filter values.
   * @route /users/logout
   * @method post
   * @param {JSON} req - request message of format {userid,auth-token,jsonData}
   * @param {JSON} res - response message for which function will generate, as specified in the Bayer PF API documentation
   * @returns {void} - nothing, instead sends a response to the client of format specified in res
   */
   pfController.getTreatment(req).then((response)=>{
      console.log(`Sending: ${JSON.stringify(response)} /treatments`);
      res.status(response.status).send(response);
   });
});

router.post('/medicals', (req, res, next)=>{
    /**
     * Generate the PatientFinder data required for data visualization (graph) purpose. For treatments only.
     * jsonData contains filter values.
     * @route /users/logout
     * @method post
     * @param {JSON} req - request message of format {userid,auth-token,jsonData}
     * @param {JSON} res - response message for which function will generate, as specified in the Bayer PF API documentation
     * @returns {void} - nothing, instead sends a response to the client of format specified in res
     */
    pfController.getMedicalCondition(req).then((response)=>{
        console.log(`Sending: ${JSON.stringify(response)} for /medicals`);
        res.status(response.status).send(response);
    });
});

/* --- For testing only --- */
router.get('/check-access', (req,res,next)=>{
    pfController.checkCredentials(req).then((response)=>{
        console.log(response);
        if(response){
            res.send({access: 1});
        }else{
            res.send({access: 0});
        }
    });

});

module.exports = router;
