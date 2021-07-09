module.exports = (sequelize, Sequelize) => {
    const Form = sequelize.define('form', {
        formCategory: {
            type: Sequelize.STRING,
            noUpdate: true
        },
        staffId: {
            type: Sequelize.INTEGER,
            unique: true
        },
        creator: Sequelize.STRING,
        staffName: Sequelize.STRING,
        unit: Sequelize.STRING,
        position: Sequelize.STRING,
        content: Sequelize.STRING,
        result: Sequelize.STRING,
        proposal: Sequelize.STRING,
        status: Sequelize.STRING,
        comment: Sequelize.STRING,
        timeStart: {
            type: 'TIMESTAMP',
            noUpdate: true
        },
        timeEnd: {
            type: 'TIMESTAMP',
            noUpdate: true
        }

    }, {
        omitNull: true,
        useLocalTime: true
    });
    return Form;
}