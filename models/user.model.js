/* 
    Description:
    - interviewAdmin provides an mysql connector to Node.js for user_access_admin table
*/
module.exports = (mysql, sequelize) => {
    const interviewAdmin = mysql.define(
        "user_data", {
            username: {
                type: sequelize.STRING,
                primaryKey: true
            },
            email: {
                type: sequelize.STRING,
                allowNull: false,
                unique: true
            },
            password: {
                type: sequelize.STRING
            }
        }
    );
    
    return interviewAdmin;
}