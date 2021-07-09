module.exports = (sequelize, Sequelize) => {
    const permission = sequelize.define('permission', {
        name: Sequelize.STRING
    })
    return permission;
}