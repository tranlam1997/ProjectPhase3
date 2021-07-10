module.exports = (sequelize, Sequelize) => {
    const userInfor = sequelize.define('userinfor', {
        staffId: {
            type: Sequelize.INTEGER,
            unique: true
        },
        avatar: {
            type: Sequelize.BLOB('long')
        },
        avatarName: Sequelize.STRING,
        phone: {
            type: Sequelize.STRING,
            unique: true
        },
        idCard: {
            type: Sequelize.STRING,
            unique: true
        },
        socialInsurance: {
            type: Sequelize.STRING,
            unique: true
        },
        address: Sequelize.STRING
    }, {
        omitNull: true,
        useLocalTime: true
    })
    return userInfor;
}