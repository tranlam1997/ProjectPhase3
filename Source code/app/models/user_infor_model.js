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
        dateOfBirth: Sequelize.DATE,
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
        address: Sequelize.STRING,
        accessToken : {
            type: Sequelize.STRING,
            unique: true
        }
    })
    return userInfor;
}