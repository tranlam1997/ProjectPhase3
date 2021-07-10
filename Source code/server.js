const express = require('express');
const app = express();
const logger = require('morgan');
const cors = require('cors');
const db = require('./app/models');
const { checkPath } = require('./app/middlewares');
const User = db.user;
const bcrypt = require('bcrypt');
require('dotenv').config();
const PORT = process.env.PORT || 8080;


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




db.sequelize.sync({force: true}).then(async () => {
    const admin = await User.create({
        userName: 'admin',
        password:  bcrypt.hashSync(process.env.ADMIN_SECRET_KEY, parseInt(process.env.CRYPTO_KEY)),
        email: 'foet1997@gmail.com',
        phone: '0946377596'
    }).catch(err => res.status(500).send({message: `Error while creating user \n ${err}`}));
    const role = await admin.createRole({ nameOfRole : 'admin'}).catch(err => res.status(500).send({message: `Error while set role admin \n ${err}`}));
    await admin.addRole(role);
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