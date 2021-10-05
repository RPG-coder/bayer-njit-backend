const database = require("../models");
/* -- 
   
exports.fetchLabels = (req, res) => {
    const {QueryTypes} = database.Sequelize;
    
    let condition = false, wherePart = "";

    database.mysql.query(
        `SELECT * FROM label_info ${condition?`WHERE ${wherePart}`:""}`, {type: QueryTypes.SELECT}).then(
        (data) => {
            res.status(200).send({message: data});
        }
    ).catch((e)=>{console.log(e)});
};


exports.fetchValues = (req, res) => {
    if(req.body.column && req.body.type){
        const {QueryTypes} = database.Sequelize;

        database.mysql.query(
            `SELECT ${req.body.column} FROM ${(req.body.type==='patients')?'patients_info':'label_info'} ${req.body.condition?`where ${req.body.condition}`:""}`, 
            {type: QueryTypes.SELECT}
        ).then(
            (data) => {
                res.status(200).send({table: data});
            }
        ).catch((e)=>{console.log(e)});
    }else{
        res.status(404).send({error:1, message: "No columns and type passed!!"});
    }
};

exports.fetchDistinctValues = (req, res) => {
    if(req.body.column && req.body.type){
        const {QueryTypes} = database.Sequelize;

        database.mysql.query(
            `SELECT distinct(${req.body.column}) FROM ${(req.b
                ody.type==='patients')?'patients_info':'label_info'}`, {type: QueryTypes.SELECT}).then(
            (data) => {
                res.status(200).send({table: data});
            }
        ).catch((e)=>{console.log(e)});
    }else{
        res.status(404).send({error:1, message: "No column and type passed!!"});
    }
};

-- */


/* --- Validation of Array is still left --- */
exports.fetchView = (req, res) => {
    if(req.body.group_condition && req.body.states && 
       req.body.treatments && req.body.medical_conditions){
        database.mysql.query(`DROP VIEW IF EXISTS B`);

        let groupByConditionQuery = "", stateQuery = "";
        let medicalORSum = 0, treatmentORSum = 0, medicalANDSum = 0, treatmentANDSum = 0;
        let error = 1, errorMessage = "";

        /* --- Checking if Group By conditions exists!! & Setting groupBy conditions --- */
        if(req.body.group_condition.group_by && req.body.group_condition.selection){
            groupByConditionQuery = req.body.group_condition.selection.map((e,i)=>{
                return `${req.body.group_condition.group_by}=${e}`
            }).join(" OR ");
        }else{ error = 1; errorMessage="Grouping condition, ";}
        
        /* --- Setting states conditions --- */
        stateQuery = req.body.states.map((e,i)=>{
            return `${req.body.states}=${e}`
        }).join(" OR ");

        /* --- Setting Treatments & Medical conditions --- */
        if(req.body.treatments.OR || req.body.treatments.AND){
            
            if(req.body.treatments.OR){
                treatmentORSum += req.body.treatments.OR.reduce((prev,current,i)=>{
                    return prev + current;
                });
            }

            if(req.body.treatments.AND){
                treatmentANDSum += req.body.treatments.AND.reduce((prev,current,i)=>{
                    return prev + current;
                });
            }
            
        }else{ error = 1; errorMessage+="Treatments condition, ";}

        if(req.body.medical_conditions.OR || req.body.medical_conditions.AND){
            
            if(req.body.medical_conditions.OR){
                medicalORSum += req.body.medical_conditions.OR.reduce((prev,current,i)=>{
                    return prev + current;
                });
            }

            if(req.body.medical_conditions.AND){
                medicalANDSum += req.body.medical_conditions.AND.reduce((prev,current,i)=>{
                    return prev + current;
                });
            }
            
        }else{ error = 1; errorMessage+="Medical condition, ";}
        

        /* --- Checking Errors --- */
        if(error===1){
            res.status(500).send({error: 1, statusMessage: "Bad Request", message: errorMessage+" parameters missing/invalid"})
            console.log(`[ERROR]: ${{error: 1, statusMessage: "Bad Request", message: errorMessage+" parameters missing/invalid"}}`);
            return;
        }

        /* --- Query Formation --- */
        const query = (
            `CREATE VIEW B AS (SELECT medical_condition, treatment, paytyp, state, pop FROM patients_info `+
            /* Static condition checking */
            `WHERE ${stateQuery} AND ${groupByConditionQuery} `+
            /* Dynamic condition checking */
            /* Medical AND/OR condition check */
            `AND medical_condition & ${medicalANDSum} = ${medicalANDSum} AND medical_condition & ${medicalORSum} <> 0 `+
            /* Treatment AND/OR condition check */
            `AND medical_condition & ${treatmentANDSum} = ${treatmentANDSum} AND treatment & ${treatmentORSum} <> 0`
        );
        console.log(`[EXECUTING]: ${query}`);

        /* --- Query Execution --- */
        database.mysql.query(
            query, {type: QueryTypes.SELECT}).then(
            (data) => {
                /* --- VIEW B is created --- */    

                /* --- Generating the Final Results --- */
                const result = (
                    `SELECT COUNT(*) AS ALL_DATA,`+
                    req.body.treatments.labels.map((e,i)=>{ return ` SUM(treatment & ${2**i}) >> ${i} AS ${e}` }).join() +
                    ` ${req.body.group_condition.group_by} FROM B GROUP BY ${req.body.group_condition.group_by}`
                );

                /* --- Generating a Response --- */
                database.mysql.query( result, {type: QueryTypes.SELECT}).then((data)=>{
                    console.log.data(data);

                    res.status(200).send({
                        group_condition: req.body.group_condition,
                        treatments: {
                            labels: req.body.treatments.labels,
                            data: {}                            
                        },
                        medicalConditions: {
                            labels: req.body.medical_conditions.labels,
                            data: {}                            
                        }
                    });
                    
                    database.mysql.query(`DROP VIEW IF EXISTS B`);
                });
                

                //req.body.medicalConditions.labels.map((e,i)=>{ return ` SUM(medical_condition & ${2**i}) >> ${i} as ${e}` }).join() +


            }
        ).catch((e)=>{
            console.log(e);
            res.status(500).send({error: 1, statusMessage: "", message: "Somethings wrong with the Server!"});
        });

    }else{
        res.status(400).send({error: 1, statusMessage: "Bad Request", message: "Post parameters invalid/missing!"})
    }
};


/*
 let groupByClause = "", whereClause = "", error=0, errorReason="";

        if(req.body.groupCondition.groupBy && req.body.groupCondition.selection){

            whereClause = req.body.groupCondition.selection.map((e,i)=>{
                return `${req.body.groupCondition.groupBy}=${e}`
            }).join(" OR ");
            groupByClause = `GROUP BY ${req.body.groupCondition.groupBy}`;

        }else{
            error=1; errorReason="Grouping";
        }

        whereClause += " AND " + req.body.states.map((e,i)=>{
            return `${req.body.states}=${e}`
        }).join(" OR ");

        /* --- Requires Atleast 1 to show case a Graph --- *
        if(req.body.treatments.labels && (req.body.treatments.OR || req.body.treatments.AND)){
            if(req.body.treatments.OR){
                whereClause = req.body.treatments.OR.map((e,i)=>{
                    return `treatment & ${e} >> ${i} = `
                }).join(" OR ");
                groupByClause = `GROUP BY ${req.body.groupCondition.groupBy}`;    
            }
            
        }else{
            error=1; errorReason="Treatment AND/OR";
        }

*/