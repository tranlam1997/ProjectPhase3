module.exports = (sequelize, Sequelize) => {
    const userInfor = sequelize.define('userinfor', {
        staffId: {
            type: Sequelize.INTEGER,
            unique: true
        },
        avatar: {
            type: Sequelize.BLOB('long'),
            get() {
                return this.getDataValue('avatar').toString('utf8');
            }
        },
        avatarName: Sequelize.STRING,
        idCard: {
            type: Sequelize.INTEGER,
            unique: true
        },
        socialInsurance: {
            type: Sequelize.STRING,
            unique: true
        },
        address: Sequelize.INTEGER,
        accessToken: {
            type: Sequelize.STRING,
            unique: true
        },
        refreshToken: {
            type: Sequelize.STRING,
            unique: true,
        }
    }, {
        omitNull: true,
        useLocalTime: true
    })
    return userInfor;
}