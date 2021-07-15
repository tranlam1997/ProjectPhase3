module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define('user', {
        userName: {
            type: Sequelize.STRING,
            unique: true
        },
        password: Sequelize.STRING,
        firstName: Sequelize.STRING,
        lastName: Sequelize.STRING,
        email: {
            type: Sequelize.STRING,
            unique: true
        }       
    });
    return user;
}