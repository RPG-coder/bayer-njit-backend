const express = require('express');
const router = express.Router();
const pfController = require('../controllers/patientfinder.controller');
const {appLogger} = require('../logs/logger');

/* --- Route: /patientfinder (via. app.use('/patientfinder'))--- */
/* --- 1. Routes: For Getters for Filter values --- */
router.get('/labels', (req,res,next)=>{
    /**
     * @route /patientfinder/labels
     * @method get
     * @param {JSON} req - request message of format {userid, authToken}
     * @param {JSON} res - response message for which the function generates format, {status, success=1, labelData} or {status, success=0, message, error}
     * @return {void} Nothing is returned, but the response message sent to the client
     */
    const route = '/patientfinder/labels';
    appLogger.info(`[RECEIVED]: Request ${JSON.stringify(req.query)} for ${route}`);
    pfController.getLabels(req).then((response)=>{
        appLogger.info(`[SENDING]: Response ${JSON.stringify(response)} for ${route}`);
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
    const route = '/patientfinder/values/paytyp';
    appLogger.info(`[RECEIVED]: Request ${JSON.stringify(req.query)} for ${route}`);
    pfController.getPaytype(req).then((response)=>{
        appLogger.info(`[SENDING]: Response ${JSON.stringify(response)} for ${route}`);
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
    const route = '/patientfinder/values/states';
    appLogger.info(`[RECEIVED]: Request ${JSON.stringify(req.query)} for ${route}`);
    pfController.getStates(req).then((response)=>{
        appLogger.info(`[SENDING]: Response ${JSON.stringify(response)} for ${route}`);
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
    const route = '/patientfinder/values/cohort';
    appLogger.info(`[RECEIVED]: Request ${JSON.stringify(req.query)} for ${route}`);
    pfController.getCohort(req).then((response)=>{
        appLogger.info(`[SENDING]: Response ${JSON.stringify(response)} for ${route}`);
        res.status(response.status).send(response);
    });
});

/* ---------------------------------------------------------------------------------- */
/* --- 2. Routes: for Bar Graph generation --- */

router.post('/treatments', (req, res, next)=>{
  /**
   * Generate the PatientFinder data required for data visualization (graph) purpose. For treatments only.
   * jsonData contains filter values.
   * @route /patientfinder/treatments
   * @method post
   * @param {JSON} req - request message of format {userid,auth-token,jsonData}
   * @param {JSON} res - response message for which function will generate, as specified in the Bayer PF API documentation
   * @returns {void} - nothing, instead sends a response to the client of format specified in res
   */
    const route = '/patientfinder/treatments';
    appLogger.info(`[RECEIVED]: Request ${JSON.stringify(req.body)} for ${route}`);
   pfController.getTreatment(req).then((response)=>{
      appLogger.info(`[SENDING]: Response ${JSON.stringify(response)} for ${route}`);
      res.status(response.status).send(response);
   });
});

router.post('/medicals', (req, res, next)=>{
    /**
     * Generate the PatientFinder data required for data visualization (graph) purpose. For medical_conditions only.
     * jsonData contains filter values.
     * @route /patientfinder/medicals
     * @method post
     * @param {JSON} req - request message of format {userid,auth-token,jsonData}
     * @param {JSON} res - response message for which function will generate, as specified in the Bayer PF API documentation
     * @returns {void} - nothing, instead sends a response to the client of format specified in res
     */
     const route = '/patientfinder/medical';
     appLogger.info(`[RECEIVED]: Request ${JSON.stringify(req.body)} for ${route}`);
    pfController.getMedicalCondition(req).then((response)=>{
        appLogger.info(`[SENDING]: Response ${JSON.stringify(response)} for ${route}`);
        res.status(response.status).send(response);
    });
});

/* --- For testing only --- */
const checkAccessRequestBodyResponse = (req,res)=>{
    const route = '/patientfinder/check-access';
    appLogger.info(`[RECEIVED]: Request ${JSON.stringify((req.method.toLowerCase() === "get" || req.method.toLowerCase() ==='delete')?req.query:req.body)} for ${route}`);
    pfController.checkCredentials(req).then((response)=>{
        if(response){
            res.send({access: 1});
            appLogger.info(`[STATUS]: OK`);
        }else{
            res.send({access: 0});
            appLogger.info(`[STATUS]: FAILED`);
        }
    });
}
router.get('/check-access', (req,res,next)=>{checkAccessRequestBodyResponse(req,res);});
router.put('/check-access', (req,res,next)=>{checkAccessRequestBodyResponse(req,res);});
router.post('/check-access', (req,res,next)=>{checkAccessRequestBodyResponse(req,res);});
router.delete('/check-access', (req,res,next)=>{checkAccessRequestBodyResponse(req,res);});

module.exports = router;
