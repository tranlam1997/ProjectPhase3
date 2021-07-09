module.exports = (sequelize, Sequelize) => {
    const role = sequelize.define('role', {
        name: Sequelize.STRING 
    })
    return role;
}