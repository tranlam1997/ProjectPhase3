module.exports = (sequelize, Sequelize) => {
    const role = sequelize.define('role', {
        employee: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        manager: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        hr: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        director: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        admin: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    })
    return role;
}