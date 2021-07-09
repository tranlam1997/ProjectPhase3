const db = require('../models');
const Form = db.form;


const checkExpiration = async (req,res,next) => {
    const {formId} = req.query;
    const form = await Form.findOne({
        where: {
            id : formId
        }
    }).catch(err => res.status(500).send({message: "Error while finding form \n" + err}));
    if(!form) res.status(404).send({message: "Form not found"});
    req.form = form;
    const isExpired = form.timeEnd.getTime() - (new Date().getTime());
    if(isExpired < 0){
        form.status = "expired";
        await form.save().catch(err => res.status(500).send({message: `Error while changing status of form \n ${err}`}));
        return res.status(200).send({
            message: "This form is expired. Please choose another form"
        });
    } else{
        next();
    }
}

module.exports = { checkExpiration}