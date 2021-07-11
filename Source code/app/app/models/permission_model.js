module.exports = (sequelize, Sequelize) => {
    const permission = sequelize.define('permission', {
        classification: Sequelize.STRING, 
        permissionDetail: Sequelize.STRING
    })
    return permission;
}