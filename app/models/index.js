require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
    },
    timezone: '+07:00',
    pool: {
        max: parseInt(process.env.POOL_MAX),
        min: parseInt(process.env.POOL_MIN),
        acquire: parseInt(process.env.POOL_ACQUIRE),
        idle: parseInt(process.env.POOL_IDLE)
    }
})

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.user = require('./user.model.js')(sequelize, Sequelize);
db.userInfor = require('./user.infor.model')(sequelize, Sequelize);
db.role = require('./role.model.js')(sequelize, Sequelize);
db.permission = require('./permission.model.js')(sequelize, Sequelize);
db.form = require('./form.model')(sequelize, Sequelize);



db.user.hasMany(db.user, {as : "subordinates", foreignKey: "managed by userId"});
db.user.hasOne(db.userInfor);
db.userInfor.belongsTo(db.user);
db.user.hasMany(db.form);
db.form.belongsTo(db.user);
db.user.hasMany(db.role);
db.role.belongsToMany(db.user, {
    through: 'user_role'
});


db.role.hasMany(db.permission);


db.permission.belongsToMany(db.role, {
    through: 'role_permission'
});
module.exports = db;