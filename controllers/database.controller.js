const database = require("../models");

exports.fetchLabels = (req, res) => {
    const {QueryTypes} = database.Sequelize;

    database.mysql.query(
        `SELECT * FROM label_info`, {type: QueryTypes.SELECT}).then(
        (data) => {
            /*Print LabelInfo: console.log(JSON.stringify(data))*/
            res.status(200).send({labels: data});
        }
    ).catch((e)=>{console.log(e)});
};

const initializeQuery = (req,res)=>{

    database.mysql.query(`DROP VIEW IF EXISTS B`);
    let groupByConditionQuery = "", stateQuery = "";
    let treatmentORSum = 0, treatmentANDSum=0, medicalORSum = 0, medicalANDSum = 0;
    let error = 0, errorMessage = "", group_by="";

    /* --- Checking if Group By conditions exists!! & Setting groupBy conditions --- */
    if(req.body.group_condition.group_by && req.body.group_condition.selection){
        req.body.group_condition.group_by = group_by = (req.body.group_condition.group_by == "paytype")?"paytyp":"pop";
        groupByConditionQuery = req.body.group_condition.selection.map((e,i)=>{
            return `${group_by}='${e}'`
        }).join(" OR ");
    }else{ error = 1; errorMessage="Grouping condition, ";}
    
    /* --- Setting states conditions --- */
    stateQuery = req.body.states.map((e,i)=>{ return `state='${e}'` }).join(" OR ");

    /* --- Setting Medical & Treatment conditions --- */
    if(
        (req.body.medical_conditions.OR && req.body.medical_conditions.OR.length>0) || 
        (req.body.medical_conditions.AND && req.body.medical_conditions.AND.length>0)
    ){
        
        if(req.body.medical_conditions.OR && req.body.medical_conditions.OR.length>0){
            medicalORSum += req.body.medical_conditions.OR.reduce((prev,current,i)=>{
                return prev + current;
            });
        }

        if(req.body.medical_conditions.AND && req.body.medical_conditions.AND.length>0){
            medicalANDSum += req.body.medical_conditions.AND.reduce((prev,current,i)=>{
                return prev + current;
            });
        }
        
    }/*else{ error = 1; errorMessage+="Medical condition, ";}*/

    if(
        (req.body.treatments.OR && req.body.treatments.OR.length>0) || 
        (req.body.treatments.AND && req.body.treatments.AND.length>0)
    ){
        if(req.body.treatments.OR && req.body.treatments.OR.length>0){
            treatmentORSum += req.body.treatments.OR.reduce((prev,current,i)=>{
                return prev + current;
            });
        }

        if(req.body.treatments.AND && req.body.treatments.AND.length>0){
            treatmentANDSum += req.body.treatments.AND.reduce((prev,current,i)=>{
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
            ((req.body.medical_conditions.AND && req.body.medical_conditions.AND.length>0)?` AND medical_condition & ${medicalANDSum} = ${medicalANDSum}`:'') +
            ((req.body.medical_conditions.OR && req.body.medical_conditions.OR.length>0)?` AND medical_condition & ${medicalORSum} <> 0 `:'') +
            ((req.body.treatments.AND && req.body.treatments.AND.length>0)?` AND treatment & ${treatmentANDSum} = ${treatmentANDSum}`:'')+
            ((req.body.treatments.OR && req.body.treatments.OR.length>0)?` AND treatment & ${treatmentORSum} <> 0 `:'') +
        `)`
    );

    return [query, groupByConditionQuery, error, errorMessage, group_by];
}
const userGraphClick = (req)=>{
    let error = 0;
    if(req.body && req.body.userid){
        historyTable.create({userid: req.body.userid,json_data: req.body}).then((data)=>{
            console.log("[INFO]: New History created! and Click's Registered!");
        }).catch((e)=>{
            historyTable.update({json_data: req.body},{where: {username: req.body.userid}}).then((data)=>{
                console.log("[INFO]: Existing History updated! and Click's Registered!");
            }).catch()((e)=>{
                error = 1;
                console.log("[ERROR]: User click is not recorded into history!");
            });
        });
    }else{
        console.log("[ERROR]: Update click request for User Graph doesnot support req body parameters in the API format!");
    }
}


exports.fetchViewMedical = (req, res) => {
    /*console.log(JSON.stringify(req.body))*/
    if(
        req.body.group_condition && req.body.states && req.body.medical_conditions && req.body.treatments && 
        Object.keys(req.body.group_condition).length > 0 && Object.keys(req.body.states).length > 0 && 
        Object.keys(req.body.medical_conditions).length > 0 && Object.keys(req.body.treatments).length > 0
    ){
        const {QueryTypes} = database.Sequelize;
        let query, groupByConditionQuery, error, errorMessage, group_by;
        [query, groupByConditionQuery, error, errorMessage, group_by] = initializeQuery(req,res);

        /*console.log(`[EXECUTING]: ${query}`);*/

        /* --- Checking Errors --- */
        if(error===1){
            res.status(400).send({error: 1, statusMessage: "Bad Request", message: errorMessage+" parameters missing/invalid"})
            console.log(`[ERROR]: ${JSON.stringify({error: 1, statusMessage: "Bad Request", message: errorMessage+" parameters missing/invalid"})}`);
            return;
        }

        if(
            (req.body.medical_conditions.OR && req.body.medical_conditions.OR.length>0) || 
            (req.body.medical_conditions.AND && req.body.medical_conditions.AND.length>0)
        ){
            /* --- Medical Query Execution --- */
            database.mysql.query(query).then(
                (data0) => {
                    /* --- VIEW B is created --- */    

                    database.mysql.query(`SELECT label, label_val FROM label_info WHERE label_type='medical_condition' ORDER BY label_val`, {type: QueryTypes.SELECT}).then((data1)=>{
                        /* --- Generating the Final Results --- */
                        
                        const label=[]
                        for(let i=0;i<data1.length;i++){ label.push(data1[i]['label']) }

                        const sumOfLabelQuery = (label.map((e,i)=>{ return [e,` SUM(medical_condition & ${2**i}) >> ${i} AS ${e}`] })
                        .filter((e,i)=>req.body.medical_conditions.labels.includes(e[0])).map((e)=>e[1])
                        .join());

                        console.log(`[INFO]: Selecting Medical Labels ${req.body.medical_conditions.labels.join()}`);
                        
                        const result = (
                            `SELECT COUNT(*) AS ALL_DATA, ${sumOfLabelQuery}, ${group_by} FROM B `+
                            `GROUP BY ${group_by} HAVING ${groupByConditionQuery}`
                        );
                        /*console.log(`[Executing]: ${result}`);*/

                        /* --- Generating a Response --- */
                        database.mysql.query( result, {type: QueryTypes.SELECT}).then((data)=>{
                            
                            //console.log(data[0]);

                            const medicalLabels = Object.keys(data[0]);
                            medicalLabels.pop();

                            const medicalData = data.map((e,i)=>{
                                const medicalValues = Object.values(e);
                                const type = medicalValues.pop();
                                return {
                                    type: type,
                                    data: medicalValues
                                }    
                            });
                            
                            console.log(`[SENDING]:`+JSON.stringify(data))

                            res.status(200).send({
                                group_condition: req.body.group_condition,
                                medical_conditions: {
                                    labels: medicalLabels,
                                    data: medicalData
                                }
                            });
                            
                            /* --- This records user click data --- */
                            userGraphClick(req);

                            database.mysql.query(`DROP VIEW IF EXISTS B`);
                        });
                    });
                }
            ).catch((e)=>{
                console.log(e);
                res.status(500).send({error: 1, statusMessage: "Internal Server Error", message: "Somethings wrong with the Server!"});
            });

        }else{
            res.status(400).send({error: 1, statusMessage: "Bad Request", message: "Treatment parameters invalid/missing!"})
        }
    } else{
        res.status(400).send({error: 1, statusMessage: "Bad Request", message: "Post parameters invalid/missing!"});
    }
};



exports.fetchViewTreatment = (req, res) => {
    if(
        req.body.group_condition && req.body.states && req.body.medical_conditions && req.body.treatments && 
        Object.keys(req.body.group_condition).length > 0 && Object.keys(req.body.states).length > 0 && 
        Object.keys(req.body.medical_conditions).length > 0 && Object.keys(req.body.treatments).length > 0
    ){
        const {QueryTypes} = database.Sequelize;
        let query, groupByConditionQuery, error, errorMessage, group_by;
        [query, groupByConditionQuery, error, errorMessage, group_by] = initializeQuery(req,res);

        /*console.log(`[EXECUTING]: ${query}`);*/

        /* --- Checking Errors --- */
        if(error===1){
            res.status(400).send({error: 1, statusMessage: "Bad Request", message: errorMessage+" parameters missing/invalid"})
            console.log(`[ERROR]: ${JSON.stringify({error: 1, statusMessage: "Bad Request", message: errorMessage+" parameters missing/invalid"})}`);
            return;
        }
        if(
            (req.body.treatments.OR && req.body.treatments.OR.length>0) || 
            (req.body.treatments.AND && req.body.treatments.AND.length>0)
        ){
            /* --- Treatment Query Execution --- */
            database.mysql.query(query).then(
                (data0) => {
                    /* --- VIEW B is created --- */    
                    
                    database.mysql.query(`SELECT label, label_val FROM label_info WHERE label_type='treatment' ORDER BY label_val`, {type: QueryTypes.SELECT}).then((data1)=>{
                        /* --- Generating the Final Results --- */
                        
                        const label=[]
                        for(let i=0;i<data1.length;i++){ label.push(data1[i]['label']) }

                        const sumOfLabelQuery = (
                            label.map((e,i)=>{ return [e,` SUM(treatment & ${2**i}) >> ${i} AS ${e}`] })
                            .filter((e,i)=>req.body.treatments.labels.includes(e[0])).map((e)=>e[1])
                            .join()
                        );

                        console.log(`[INFO]: Selecting Treatment Labels ${req.body.treatments.labels.join()}`);

                        const result = (
                            `SELECT COUNT(*) AS ALL_DATA, ${sumOfLabelQuery}, ${group_by} FROM B `+
                            `GROUP BY ${group_by} HAVING ${groupByConditionQuery}`
                        );
                        /*console.log(`[Executing]: ${result}`);*/

                        /* --- Generating a Response --- */
                        database.mysql.query( result, {type: QueryTypes.SELECT}).then((data)=>{
                            
                            //console.log(data[0]);

                            const treatmentLabels = Object.keys(data[0]);
                            treatmentLabels.pop();

                            const treatmentData = data.map((e,i)=>{
                                const treatmentValues = Object.values(e);
                                const type = treatmentValues.pop();
                                return {
                                    type: type,
                                    data: treatmentValues
                                }    
                            });
                            
                            console.log(`[SENDING]:`+JSON.stringify(data))

                            res.status(200).send({
                                group_condition: req.body.group_condition,
                                treatments: {
                                    labels: treatmentLabels,
                                    data: treatmentData
                                }
                            });
                            
                            database.mysql.query(`DROP VIEW IF EXISTS B`);
                        });
                    });
                }
            ).catch((e)=>{
                console.log(e);
                res.status(500).send({error: 1, statusMessage: "Internal Server Error", message: "Somethings wrong with the Server!"});
            });
        }else{
            res.status(400).send({error: 1, statusMessage: "Bad Request", message: "Treatment parameters invalid/missing!"});
        }


    }else{
        res.status(400).send({error: 1, statusMessage: "Bad Request", message: "Post parameters invalid/missing!"})
    }
};

/*
    Bug Fixes:
    - Fixed Label selection problem
    - Optimized code for fetchMedical & fetchTreatment, introduced reuse
    - New feature: User last click history
    
    Requires:
    - Model Controller seperation ... (in future)
    - Introducing React SEQUELIZE Migration ... (in future)
    - Input validation 
      - strip spaces in user.controller.js

*/