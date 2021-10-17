/* --- Import Files --- */
const database = require("../models");
const {v4} = require('uuid');
const patientData = database.patients_info;
const labelData = database.label_info;
const {Op} = database.Sequelize;

/*********************************************************
 * Controller for Bayer Patient Finder: Relating to the Patient Finder Task
 * for more information on the API documentation please visit: <Doc_Link_here>
 * 
 * @contain functions (interface function)
 * 1. getLabels() - safe
 * 2. getStates() - safe
 * 3. getPaytype() - safe
 * 4. getCohort() - safe
 * 5. getMedicalCondition() - safe
 * 6. getTreatment() - safe
 * 
 * @helperFunctions
 * checkCredentials() - safe
 * getDistinctValues() - safe
 * processRequest - safe (doesn't affect the existing data)
 * generateGraphResponseFor - safe (doesn't affect the existing data)
 * getGraphDataFor - safe (doesn't affect the existing data)
 * 
 * safe - makes no changes in database, or atleast existing data.
 * unsafe - makes a change to the database
*********************************************************/


/* --- Controller: Methods for accessing Patient Finder Data --- */
const checkCredentials = async (req)=>{
    try{
        const user = await database['User'].findOne({where:{userid: req.body.userid}});
        return user.authToken===req.body.authToken;
    }catch(err){
        return false;
    }
}
exports.checkCredentials = checkCredentials;
exports.getLabels = async (req)=>{
    /**
     * Get all medical_condition and treatment labels present in label_info table
     * @function getLabels()
     * @param {JSON} req - request message of format {userid, authToken}
     * @returns {JSON} - response message containing Label data from label_info table
    **/

    if(await checkCredentials(req)){ /* Check if the user is having proper authorization credentials */
        try{
            const labels = await labelData.findAll({
                where: {
                    label_type: ['medical_condition','treatment']
                }
            });
            return {
                status: 200, 
                success:1, 
                labelData: labels
            };
        } catch(err){ 
            return {
                status: 500,
                success: 0,
                message: "Internal Server Error!", 
                error: err
            }; 
        }
    }else{
        return {
            status: 401,
            success: 0,
            message: "Unauthorized action!", 
            error: err
        }; 
    }
};

const getDistinctValues = async (req, modelData, columnName)=>{
    /**
     *  @function getDistinctValues()
     *  @param {Sequelize.Model} modelData - instance of Sequelize.Model that is having connection with a table inside the database
     *  @param {string} columnName - Name of the column whose distinct values are needed to be found
     *  @returns {JSON} a response message containing the distinct values within the column with it's name as columnName
    **/
    if(await checkCredentials(req)){
        console.log(modelData);
        try{
            const data = await modelData.findAll({
                attributes: [[database.Sequelize.fn('DISTINCT', database.Sequelize.col(columnName)), columnName]]
            }); 
            
            const response = {
                status: 200,
                success:1,
            };
            response[`${columnName}Data`] = data;
            return response;
            
        } catch(err){
            return {
                status: 500, 
                success: 0, 
                message: "Internal Server Error!", 
                error: err
            };
        }

    }else{
        return {
            status: 401,
            success:0,
            message: "Unauthorized action!", 
            error: err
        }; 
    }
};
exports.getPaytype = async (req)=>{ return (await getDistinctValues(req, patientData, 'paytyp')); };
exports.getCohort = async (req)=>{ return (await getDistinctValues(req, patientData, 'pop')); };
exports.getStates = async (req)=>{ return (await getDistinctValues(req, patientData, 'state')); };



/* --- Controller: For /medicals and /treatments --- */
const processRequest = async (req) => {
    /**
     * ProcessRequest and generates the following,
     * query: MySQL Query string for a generating temporary container specific to the request message.
     * groupByConditionQuery: A string that contains the group by's condition part of MySQL query.
     * group_by: A string for to indicate the MySQL label used for forming the group by's condition.
     * error: an integer where value 1 indicates any processing error and 0 indicates no errors.
     * errorMessage: a string describing the reason for the error to occur
     * @function processRequest()
     * @param {JSON} req - filter data (req.body.jsonData, not the req or req.body)
     * @returns {Array} an array containing [query, groupByConditionQuery, error, errorMessage, group_by]. These are the intermediate results after request is processed.
    **/

    /* If the temporary storage view B exists then delete it... */
    await database.sequelize.query(`DROP VIEW IF EXISTS B`);

    let groupByConditionQuery = "", stateQuery = "";
    let treatmentORSum = 0, treatmentANDSum=0, medicalORSum = 0, medicalANDSum = 0;
    let error = 0, errorMessage = "", group_by="";

    /* --- Checking if Group By conditions exists!! & Setting groupBy conditions --- */
    if(req.group_condition.group_by && req.group_condition.selection){
        req.group_condition.group_by = group_by = (req.group_condition.group_by == "paytype")?"paytyp":"pop";
        groupByConditionQuery = req.group_condition.selection.map((e,i)=>{
            return `${group_by}='${e}'`
        }).join(" OR ");
    } else{ error = 1; errorMessage="Grouping condition, ";}
    
    /* --- Setting states conditions --- */
    stateQuery = req.states.map((e,i)=>{ return `state='${e}'` }).join(" OR ");

    /* --- Setting Medical & Treatment conditions --- */
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
        
    }/*else{ error = 1; errorMessage+="Medical condition, ";}*/

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
        
    }/*else{ error = 1; errorMessage+="Treatments condition, ";}*/
    

    /* --- Query Formation --- */
    const query = (
        `CREATE VIEW B AS (` +
            `SELECT medical_condition, treatment, paytyp, state, pop FROM patients_info `+
            /* Static condition checking */
            `WHERE ${stateQuery} AND ${groupByConditionQuery} ` +
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

const generateGraphResponseFor = async (req, processedArray, label_type)=>{
    /**
     * Generates a response required for data visualization (bargraph) purpose.
     * @function generateGraphResponseFor()
     * @param {JSON} req - filter data (req.body.jsonData, not the req or req.body)
     * @param {JSON} processedArray - intermediate results after request is processed
     * @param {string} label_type - select either one: 'medical_label' or 'treatment'
     * @returns {JSON} response message after request processing valid or invalid request format
    **/
    const {QueryTypes} = database.Sequelize;
    try{
        let query, groupByConditionQuery, error, errorMessage, group_by;
        [query, groupByConditionQuery, error, errorMessage, group_by] = processedArray;

        /* --- Medical Query Execution --- */
        await database.sequelize.query(query);
        /* --- VIEW B (TEMPERORY STORAGE) is now created --- */    

        
        /* --- Filter data in the View B based on selected label values mentioned in the request --- */
        console.log(`[INFO]: Selecting ${label_type} labels as ${req[`${label_type}s`].labels.join()}.`);
        const label=[], labelData = await database.sequelize.query(
            `SELECT label, label_val FROM label_info WHERE label_type='${label_type}' ORDER BY label_val`,
            {type: QueryTypes.SELECT}
        );
        for(let i=0;i<labelData.length;i++){ label.push(labelData[i]['label']); }
        const sumOfLabelQuery = (
            label
             .map((e,i) => [e,` SUM(${label_type} & ${2**i}) >> ${i} AS ${e}`] )
             .filter((e,i) => req[`${label_type}s`].labels.includes(e[0]))
             .map( (e) => e[1] )
             .join()
        );

        
        /* --- Generating a Response --- */        
        const resultingQuery = (
            `SELECT COUNT(*) AS ALL_DATA, ${sumOfLabelQuery}, ${group_by} FROM B `+
            `GROUP BY ${group_by} HAVING ${groupByConditionQuery}`
        ); /*console.log(`[Executing]: ${resultingQuery}`);*/

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

        const response = {
            status: 200,
            success: 1,
            group_condition: req.group_condition
        };
        response[`${label_type}s`] = {
            labels: graphLabels,
            data: graphData
        };

        console.log(`[SENDING]:`+JSON.stringify(response));

        /* Delete temporary storage view B, after generating response */
        await database.sequelize.query(`DROP VIEW IF EXISTS B`);
        return response;        

    }catch(err){
        return {
            status: 500, 
            success: 0, 
            message: "Internal Server Error!",
            error: err 
        }
    }
};

const getGraphDataFor = async (req, label_type)=>{
    /**
     * ProcessRequest and generates the following,
     * query: MySQL Query string for a generating temporary container specific to the request message.
     * groupByConditionQuery: A string that contains the group by's condition part of MySQL query.
     * group_by: A string for to indicate the MySQL label used for forming the group by's condition.
     * error: an integer where value 1 indicates any processing error and 0 indicates no errors.
     * errorMessage: a string describing the reason for the error to occur
     * @function getLabels()
     * @param {JSON} req - filter data (req.body.jsonData, not the req or req.body)
     * @returns {Array} an array containing [query, groupByConditionQuery, error, errorMessage, group_by]
    **/

    if(
        req.group_condition && req.states && req.medical_conditions && req.treatments && 
        Object.keys(req.group_condition).length > 0 && Object.keys(req.states).length > 0 && 
        Object.keys(req.medical_conditions).length > 0 && Object.keys(req.treatments).length > 0
    ){/* --- First Check: if there are no errors on first-level labels, i.e., if message is in suitable format for processing request --- */
        
        let query, groupByConditionQuery, error, errorMessage, group_by;
        [query, groupByConditionQuery, error, errorMessage, group_by] = await processRequest(req);
        
        if(error===1){ /* --- Second Check: If there are any errors within the request format, i.e., after processing completes --- */
            return { 
                status: 400, 
                success: 0,
                message: "Bad Request",
                error: errorMessage+" parameters missing/invalid"
            };
        }

        try{
            return await generateGraphResponseFor(req, [query, groupByConditionQuery, error, errorMessage, group_by],`${label_type}`);
        } catch(err){
            return {
                status: 400, 
                success: 0,
                message: "Bad Request",
                error: err
            };
        }
        
    } else{
        return {
            status: 400, 
            success: 0,
            message: "Bad Request",
            error: "Post parameters invalid/missing!"
        };
    }
};

/* --- Controller Interface methods for generating graph data --- */
exports.getMedicalCondition = async (req)=>{ 
    try{
        if(await checkCredentials(req)){
            return await getGraphDataFor(req.body.jsonData, 'medical_condition');
        }else{
            return {
                status: 401,
                success:0,
                message: "Unauthorized action!", 
            };
        }
    }catch(err){
        return {
            status: 400,
            success:0,
            message: "Bad Request", 
            error: err
        };
    }
};
exports.getTreatment = async (req)=>{ 
    try{
        if(await checkCredentials(req)){
            return await getGraphDataFor(req.body.jsonData, 'treatment');
        }else{
            return {
                status: 401,
                success:0,
                message: "Unauthorized action!", 
            };
        }
    }catch(err){
        return {
            status: 400,
            success:0,
            message: "Bad Request1", 
            error: err
        };
    }
};