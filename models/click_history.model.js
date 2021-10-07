/* 
    Description:
    - click_history records a user click at a point of time.
    - At the moment, every user can only retain their graph data which is belonging to their last action (or click request).
    - Future changes expected: A Users can retain history all of the their clicks and get it with a single click of a button.
*/
module.exports = (mysql, sequelize) => {
    const click_history = mysql.define(
        "click_history", {
            username: {
                type: sequelize.STRING,
                primaryKey: true
            },
            /* This will be unique for every user graph request
            saveid: {
                type: sequelize.STRING,
                primaryKey: true
                autoIncrement: true
            },save_name:{
                type: sequelize.STRING
            }*/
            json_data: {
                type: sequelize.JSON
            },
            record_time: {
                type: 'TIMESTAMP',
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            }
        }
    );
    
    return click_history;
}