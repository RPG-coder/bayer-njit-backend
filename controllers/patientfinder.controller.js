/*********************************************************
 * PatientFinder Controller module
 * @module /controllers/patientfinder.controller.js 
 * @version 1.28.2022
 * 
 * @author Rahul Gautham Putcha <rp39@njit.edu>
 * @contributors Jianlen Ren, Rahul Gautham Putcha, Jiawei Wang, Sai Kiran Pocham
 * @description contains core function for Patient finder application.
 * 
 * Functions included:
 * - Interface function, used by Routes:
 * 1. getLabels() - safe
 * 2. getStates() - safe
 * 3. getPaytype() - safe
 * 4. getCohort() - safe
 * 5. getMedicalCondition() - safe (but called via a post due to the data size complexity)
 * 6. getTreatment() - safe (but called via a post due to the data size complexity)
 * 
 * - Helper functions, used by Interface function for fullfilling an action:
 * 1. checkCredentials() - safe
 * 2. getDistinctValues() - safe
 * 3. processGraphRequest - safe (doesn't affect the existing data)
 * 4. generateGraphResponseFor - safe (doesn't affect the existing data)
 * 5. getGraphDataFor - safe (doesn't affect the existing data)
 * 
 * safe - makes no changes in database, or atleast existing data.
 * unsafe - makes a change to the database
 * 
 * For more details check out, {@link } (API Docs)
*********************************************************/

/* --- Import Files --- */
const database = require("../models");
const {v4} = require('uuid');
const patientData = database.patients_info;
const labelData = database.label_info;
const {checkCredentials, safelyProcessRequestMSG} = require('./common.controller');
const {activityLogger, errorLogger} = require("../logs/logger"); 
const {QueryTypes} = database.Sequelize;

/**
 * JSDOC setting type format for documentation purpose 
 * @typedef {{userid: string, authToken: string}} UserAuthorizationRequest
 * @typedef {{status: number, success: 1, data: any}} SuccessMessage
 * @typedef {{status: number, success: 0, message: string}} FailureMessage
 * @typedef {JSON} FuncParams
 * 
 * For more details check out, {@link } (API Docs)
 */

/** 
 * Check if the user is authorized to perform the action 
 * @function checkCredentials()
 * @param {JSON|UserAuthorizationRequest} req - request msg, an extention of type UserAuthorizationRequest message 
 * @returns {Boolean} true if ACCESS_GRANT false if ACCESS_DENIED
 */
exports.checkCredentials = checkCredentials;

/* ---------------------------------------------------------------- */
/* --- Controller: Labels and Values --- */
/* ---------------------------------------------------------------- */

/**
 * Get all medical_condition and treatment labels present in label_info table
 * @function getLabels()
 * @param {UserAuthorizationRequest} req - request msg
 * @returns {SuccessMessage|FailureMessage} - response message containing Label data from label_info table
 * 
 * For more details check out, {@link } (API Docs)
**/
exports.getLabels = async (req)=>{
    const fetchLabels = async (params)=> await labelData.findAll({where: {label_type: ['medical_condition','treatment']}});
    return await safelyProcessRequestMSG({req}, fetchLabels)
};

/**
 *  Get all column data without duplicate values
 *  @param {Sequelize.Model} modelData - instance of Sequelize.Model that is having connection with a table inside the database
 *  @param {string} columnName - Name of the column whose distinct values are needed to be found
 *  @returns {SuccessMessage|FailureMessage} a response message containing the distinct values within the column with it's name as columnName
 * 
 * For more details check out, {@link } (API Docs)
**/
const getDistinctValues = async (req, modelData, columnName)=>{
    const fetchDistinctValues = async (params)=> await params.modelData.findAll({
        attributes: [[database.Sequelize.fn('DISTINCT', database.Sequelize.col(params.columnName)), params.columnName]]
    })

    return await safelyProcessRequestMSG({req,modelData,columnName}, fetchDistinctValues);
};
/** @see {@link getDistinctValues} */
exports.getPaytype = async (req)=>{ return (await getDistinctValues(req, patientData, 'paytyp')); };
/** @see {@link getDistinctValues} */
exports.getCohort = async (req)=>{ return (await getDistinctValues(req, patientData, 'pop')); };
/** @see {@link getDistinctValues} */
exports.getStates = async (req)=>{ return (await getDistinctValues(req, patientData, 'state')); };


/* ---------------------------------------------------------------- */
/* --- Controller: For Graph Filters --- */
/* ---------------------------------------------------------------- */

/**
 * Process message based on graph filters and generates the following,
 * * query: MySQL Query string for a generating temporary container specific to the request message.
 * * groupByConditionQuery: A string that contains the group by's condition part of MySQL query.
 * * group_by: A string for to indicate the MySQL label used for forming the group by's condition.
 * * error: an integer where value 1 indicates any processing error and 0 indicates no errors.
 * * errorMessage: a string describing the reason for the error to occur
 * @function processGraphRequest()
 * @param {JSON} req - filter data (req.query.jsonData, not the req or req.query)
 * @returns {Array} an array containing [query, groupByConditionQuery, error, errorMessage, group_by]. These are the intermediate results after request is processed.
 * 
 * For more details check out, {@link } (API Docs)
**/
const processGraphRequest = async (req) => {

    /* If the temporary storage view B exists, then delete it */
    await deleteTemporaryStorage();

    let groupByConditionQuery = "", stateQuery = "";
    let treatmentORSum = 0, treatmentANDSum=0, medicalORSum = 0, medicalANDSum = 0;
    let error = 0, errorMessage = "", group_by="";

    /* Does request message contain the group by condition (payroll type or cohort) and its sub-category selection? */
    if(req.group_condition.group_by && req.group_condition.selection){
        /* Set the GroupBy and its sub-categories selection (later used for Query generation for Graph data) */
        req.group_condition.group_by = group_by = (req.group_condition.group_by == "paytype")?"paytyp":"pop";
        groupByConditionQuery = req.group_condition.selection.map((e,i)=>{
            return `${group_by}='${e}'`
        }).join(" OR ");
        
    } else{ error = 1; errorMessage="Grouping condition, ";}
    
    /* Set states conditions (later used for Query generation for Graph data) */
    stateQuery = req.states.map((e,i)=>{ return `state='${e}'` }).join(" OR ");

    /* Set Medical conditions (later used for Query generation for Graph data) */
    if(
        (req.medical_conditions.OR && req.medical_conditions.OR.length > 0) || 
        (req.medical_conditions.AND && req.medical_conditions.AND.length > 0)
    ){

        medicalORSum = 0; medicalANDSum = 0;
        if(req.medical_conditions.OR && req.medical_conditions.OR.length > 0){
            medicalORSum += req.medical_conditions.OR.reduce((prev,current,i)=>{
                return prev + current;
            });
        }
        if(req.medical_conditions.AND && req.medical_conditions.AND.length > 0){
            medicalANDSum += req.medical_conditions.AND.reduce((prev,current,i)=>{
                return prev + current;
            });
        }
        
    }

    /* Set Treatment conditions (later used for Query generation for Graph data) */
    if(
        (req.treatments.OR && req.treatments.OR.length > 0) || 
        (req.treatments.AND && req.treatments.AND.length > 0)
    ){
        treatmentORSum = 0; treatmentANDSum=0;
        if(req.treatments.OR && req.treatments.OR.length > 0){
            treatmentORSum += req.treatments.OR.reduce((prev,current,i)=>{
                return prev + current;
            });
        }

        if(req.treatments.AND && req.treatments.AND.length > 0){
            treatmentANDSum += req.treatments.AND.reduce((prev,current,i)=>{
                return prev + current;
            });
        }
        
    }
    

    /* Generate new Query specific to filters in Request message */
    const query = (
        `CREATE VIEW B AS (` +
            `SELECT * FROM patients_info `+
            /* Static condition checking */
            `WHERE ( ${stateQuery} ) AND ( ${groupByConditionQuery} ) ` +
            /* Dynamic condition checking */
            /* Medical AND/OR condition check */
            ((req.medical_conditions.AND && req.medical_conditions.AND.length > 0)?` AND medical_condition & ${medicalANDSum} = ${medicalANDSum}`:'') +
            ((req.medical_conditions.OR && req.medical_conditions.OR.length > 0)?` AND medical_condition & ${medicalORSum} <> 0 `:'') +
            ((req.treatments.AND && req.treatments.AND.length > 0)?` AND treatment & ${treatmentANDSum} = ${treatmentANDSum}`:'')+
            ((req.treatments.OR && req.treatments.OR.length > 0)?` AND treatment & ${treatmentORSum} <> 0 `:'') +
        `)`
    );

    return [query, groupByConditionQuery, error, errorMessage, group_by];
};

/**
 * Generates a response required for data visualization (bar graph) purpose.
 * @function generateGraphResponseFor()
 * @param {JSON} req - filter data (req.query.jsonData, not the req or req.query)
 * @param {Array} processedArray - intermediate results after request is processed
 * @param {string} label_type - select either one: 'medical_label' or 'treatment'
 * @returns {SuccessMessage|Error} response
 * 
 * For more details check out, {@link } (API Docs)
**/
const generateGraphResponseFor = async (req, processedArray, label_type)=>{
    try{
        
        let query, groupByConditionQuery, error, errorMessage, group_by;
        [query, groupByConditionQuery, error, errorMessage, group_by] = processedArray;

        /* Query Execution: Shortlist data based on Filter JSON data for patient data with States, Medical Conditions and Treatments  */
        await database.sequelize.query(query);
        /* --- VIEW B (TEMPERORY STORAGE) is now created --- */    
        
        /* Filter data in the View B based on selected label id's mentioned in the request */
        activityLogger.info(`[SELECTED]: ${label_type} labels as ${req[`${label_type}s`].labels.join()}.`);
        const labels=[], labelNames = [] , labelNamesMapping = {}, labelData = await database.sequelize.query(
            `SELECT label, label_val, name FROM label_info WHERE label_type='${label_type}' ORDER BY label_val`,
            {type: QueryTypes.SELECT}
        );
        for(let i=0;i<labelData.length;i++){ 
            labels.push(labelData[i]['label']);
            labelNamesMapping[labelData[i]['label']] = labelData[i]['name'];
        }
        const sumOfLabelQuery = (
            labels
             .map((e,i) => [e,` SUM(${label_type} & ${2**i}) >> ${i} AS ${e}`] )
             .filter((e,i) => {
                return req[`${label_type}s`].labels.includes(e[0])
             }).map( (e) => {
                /* e here is a label id in label_info table */
                labelNames.push(labelNamesMapping[e[0]]);
                return e[1];
              }).join()
        );

        /* Generate response 200 OK with the patient data counts for each filter labels */
        const resultingQuery = (
            `SELECT COUNT(*) AS ALL_DATA, ${sumOfLabelQuery}, ${group_by} FROM B `+
            `GROUP BY ${group_by} HAVING ( ${groupByConditionQuery} )`
        );

        const results = await database.sequelize.query(resultingQuery, {type: QueryTypes.SELECT});
        const graphLabels = Object.keys(results[0]);
        graphLabels.pop();
        const graphData = results.map((e,i)=>{
            const values = Object.values(e);
            const type = values.pop();
            return {
                type: type,
                data: values
            }    
        });

        labelNames.unshift("ALL_DATA");
        const response = {
            match: 1,
            group_condition: req.group_condition
        };
        response[`${label_type}s`] = {
            labels: labelNames,
            data: graphData
        };

        /* Delete temporary storage view B, after generating response */
        deleteTemporaryStorage();
        return response;        


    }catch(err){
        throw Error("Error in graph response:" + err);
    }
};

/**
 * Process request and generate graph response. (Reused in other functions)
 * @param {JSON} req - filter data (req.query.jsonData, not the req or req.query)
 * @returns {SuccessMessage|FailureMessage} response
 * 
 * For more details check out, {@link } (API Docs)
**/
const getGraphDataFor = async (req, label_type)=>{

    /* --- Perform First Check: If Request Message is of proper format --- */
    try{
        if(
            req.group_condition && req.states && req.medical_conditions && req.treatments && 
            Object.keys(req.group_condition).length > 0 && Object.keys(req.states).length > 0 && 
            Object.keys(req.medical_conditions).length > 0 && Object.keys(req.treatments).length > 0
        ){
            
            /* Process Request Message and find semantic/structure-related errors */
            let query, groupByConditionQuery, error, errorMessage, group_by;
            [query, groupByConditionQuery, error, errorMessage, group_by] = await processGraphRequest(req);
            
            /* CHECK: Semantic/Structure errors */
            if(error===1) throw Error(errorMessage+" parameters missing/invalid");
            
            return await generateGraphResponseFor(req, [query, groupByConditionQuery, error, errorMessage, group_by],`${label_type}`);
            
        } else{
            throw Error("Bad Request Format");
        }
    } catch(err){
        errorLogger.error({
            status: 400, 
            success: 0,
            message: "Bad Request",
            error: err
        }, req)

        return {
            match: 0,
            message: "Match not found!"
        };
    }
};

/* ---------------------------------------------------------------- */
/* --- Controller Interface methods for generating graph data --- */
/* ---------------------------------------------------------------- */
exports.getMedicalCondition = async (req)=>{ 
    return await safelyProcessRequestMSG({req}, async (params)=>{ return await getGraphDataFor(params.req.body.jsonData, 'medical_condition')});
};
exports.getTreatment = async (req)=>{ 
    return await safelyProcessRequestMSG({req}, async (params)=>{ return await getGraphDataFor(params.req.body.jsonData, 'treatment')});
};

/* ---------------------------------------------------------------- */
/* --- Population Overview section API --- */
/* ---------------------------------------------------------------- */
/**
 * Get list of states and the population of patient w.r.t the options selected in the filter settings.
 * @function getStatewiseMinMaxOfPatients()
 * @param {JSON} req - request message containing filter setting data in req.body
 * @returns {JSON} res - response  
 * 
 * For more details check out, {@link } (API Docs)
**/
const getStatewiseMinMaxOfPatients =  async (req) => {
    
    const results = await database.sequelize.query("SELECT state, count(*) as population FROM B GROUP BY state;", {type: QueryTypes.SELECT});
    const states = {};
    results.map((obj)=>{states[obj.state] = obj.population})
    return {
        states: states,
        max: Math.max(...Object.values(states)),
        min: Math.min(...Object.values(states))
    };
}

const deleteTemporaryStorage = async ()=> {
    await database.sequelize.query(`DROP VIEW IF EXISTS B`);
}

/**
 * Population Overview for a graph filter setting
 * @param {JSON} request - request message containing filter setting data in req.body
 * @returns {JSON} res - response  
 * 
 * For more details check out, {@link } (API Docs)
**/
exports.getStatePopulation = async (req) => {
    
    return await safelyProcessRequestMSG({req}, async (params)=>{
        const req = params.req.body.jsonData;
        /* First Check: If resquest message is of proper format */
        if(
            req.group_condition && req.states && req.medical_conditions && req.treatments && 
            Object.keys(req.group_condition).length > 0 && Object.keys(req.states).length > 0 && 
            Object.keys(req.medical_conditions).length > 0 && Object.keys(req.treatments).length > 0
        ){
            
            
            await deleteTemporaryStorage();
            /* Process Request Message and find semantic/structure-related errors */
            let query, groupByConditionQuery, error, errorMessage, group_by;
            [query, groupByConditionQuery, error, errorMessage, group_by] = await processGraphRequest(req);

            await database.sequelize.query(query);

            const res = {
                status: 200,
                ... await getStatewiseMinMaxOfPatients(),
                success: 1,
                message: "Successfully Completed Request"
            };
            await deleteTemporaryStorage();
            return res;
        }else{
            errorLogger.error({
                status: 400,
                success:0,
                message: "Bad Request",
                method: "getStatePopulation"
            }, req.body);
            return {
                status: 400,
                success:0,
                message: "Bad Request", 
            };
        }
    })

}

/**
 * Patient Details based on the results of graph filter setting
 * @param {JSON} request - request message containing filter setting data in req.body
 * @returns {SuccessMessage|FailureMessage} response   
 * 
 * For more details check out, {@link } (API Docs)
**/
exports.getPatientsData = async (req) => {
    
    return safelyProcessRequestMSG({req}, async (params)=>{
        const req = params.req.body.jsonData;
        if( /* FIRST CHECK: IF request is of valid format ... */
            req.group_condition && req.states && req.medical_conditions && req.treatments && 
            Object.keys(req.group_condition).length > 0 && Object.keys(req.states).length > 0 && 
            Object.keys(req.medical_conditions).length > 0 && Object.keys(req.treatments).length > 0 &&
            params.req.body.selectedState
        ){
            /* Process Request Message: Get query for generating patient data which satisfy the graph filters */
            const processedReq = await processGraphRequest(req);

            await database.sequelize.query(processedReq[0]); /* Execute the graph filter query */
            /* Create View based on Filter Data (View B)  */

            /* Get Patient Data for every label of label_type in {medical_conditions, treatments} that are specific to a given selected_state */
            const {QueryTypes} = database.Sequelize, res = await database.sequelize.query(`SELECT patid,sex,race,state,pat_age FROM B WHERE state = '${params.req.body.selectedState}' ORDER BY state;`, {type: QueryTypes.SELECT});
            await deleteTemporaryStorage();
            return res;
        }else{

            errorLogger.error({
                status: 400,
                success:0,
                message: "Bad Request",
                method: "getStatePopulation"
            }, request.body);

            /* Message is of invalid format */
            return {
                status: 400,
                success:0,
                message: "Bad Request", 
            };
        }   

    })

}

/**
 * Get the statistic on patient w.r.t race, age and popularity estimation on insurance used.
 * @param {JSON} req - request msg
 * @returns {SuccessMessage|FailureMessage} response
 * 
 * For more details check out, {@link } (API Docs)
 */
exports.getPopulationOverview = async (req)=>{
    return safelyProcessRequestMSG({req}, async (params)=>{
        return {
            raceData: await database.sequelize.query("SELECT race, count(race) AS 'count' FROM patients_info GROUP BY race;",{type: QueryTypes.SELECT}),
            ageData: await database.sequelize.query("(SELECT '18-34' AS 'group', count(*) AS 'count' FROM patients_info WHERE pat_age BETWEEN 18 AND 34) UNION (SELECT '35-64' AS 'group', count(*) AS count FROM patients_info WHERE pat_age BETWEEN 35 AND 64) UNION ( SELECT '64+' AS 'group', count(*) AS count FROM patients_info WHERE pat_age>64);", {type: QueryTypes.SELECT}),
            insuranceData: await database.sequelize.query("SELECT paytyp, count(paytyp) AS 'count' FROM patients_info GROUP BY paytyp;",{type: QueryTypes.SELECT})
        }
    })
}