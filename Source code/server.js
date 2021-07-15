const express = require('express');
const app = express();
const logger = require('morgan');
const cors = require('cors');
const db = require('./app/models');
const swaggerUI = require('swagger-ui-express');
const swaggerAPI = require('./swaggerAPI.json')
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

app.use('/hrms/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerAPI));

app.get('/', (req, res) => {
    res.json({
        project: 'Human resource management system'
    })
});

require('./app/routes')(app);


db.sequelize.sync();





app.listen(PORT, () => {
    console.log('Main server is running on port ' + PORT)
});