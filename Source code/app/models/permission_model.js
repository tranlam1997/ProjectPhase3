module.exports = (sequelize, Sequelize) => {
    const permission = sequelize.define('permission', {
        read: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        write: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        update: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        delete: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        approve: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        resource: Sequelize.STRING
    })
    return permission;
}