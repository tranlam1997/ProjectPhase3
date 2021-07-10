module.exports = (sequelize, Sequelize) => {
    const role = sequelize.define('role', {
        nameOfRole: Sequelize.STRING 
    })
    return role;
}