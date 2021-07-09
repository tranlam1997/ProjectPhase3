const express = require('express');
const app = express();
const logger = require('morgan');
const cors = require('cors');
const PORT = process.env.PORT || 8080;
const {initialPermission,initialRole} = require("./app/functions");
app.use(cors());
app.use(express.json({
    limit: '50mb',
    extended: true
}));
app.use(logger('dev'));
app.use(express.urlencoded({
    limit: '50mb',
    extended: true
}));



const db = require('./app/models');
const { checkPath } = require('./app/middlewares/checkPath')
const Role = db.role;
const Permission = db.permission;
db.sequelize.sync({force: true}).then(()=>{
  initialRole(Role);
  initialPermission(Permission);
});

app.use(checkPath);



app.get('/', (req, res) => {
    res.json({
        hello: "Hi I'm main server"
    })
});
require('./app/routes')(app);

app.listen(PORT, () => {
    console.log("Main server is running on port " + PORT)
})