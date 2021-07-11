const functions = require('../functions');
let formCategory;

module.exports = (Form, User, UserInfor, Op) => {
    const usersNotFinishedForm = async (req, res) => {
        const {page, size} = req.query;
        const {limit, offset} = functions.getPagination(page,size);
        formCategory = functions.checkFormCategory(req.path);
        const forms = await Form.findAll({
            where: {
                [Op.and]: [{
                    status: {
                        [Op.not]: 'closed'
                    }
                }, {
                    timeEnd: {
                        [Op.gt]: new Date()
                    }
                }, {
                    formCategory: formCategory
                }]
            },
            include: User, 
            limit,
            offset
        }).catch(err => res.status(500).send({
            message: `Error while finding form`,
            error : err
        }));
        if (forms.length == 0) return res.status(404).send({
            message: 'All users finished their form'
        });
        const users = forms.map(user => ({
            userId: user.userId,
            userName: user.user.userName
        }));
        res.status(200).send({
            message: `Here are all users that not finished ${formCategory} form yet`,
            total: users.length,
            users: users
        });
    }

    const usersFinishedForm = async (req, res) => {
        const {page, size} = req.query;
        const {limit, offset} = functions.getPagination(page,size);
        formCategory = functions.checkFormCategory(req.path);
        const forms = await Form.findAll({
            where: {
                [Op.and]: [{
                    status: 'closed'

                }, {
                    timeEnd: {
                        [Op.gt]: new Date()
                    }
                }, {
                    formCategory: formCategory
                }]
            },
            include: User, 
            limit, 
            offset
        }).catch(err => res.status(500).send({
            message: `Error while finding form`,
            error : err
        }));
        if (forms.length == 0) return res.status(404).send({
            message: `All users not finished their ${formCategory} form`
        });
        const users = forms.map(user => ({
            userId: user.userId,
            userName: user.user.userName
        }));
        res.status(200).send({
            message: `Here are all users that finished ${formCategory} form`,
            total: users.length,
            users: users
        });
    }


    return {
        usersNotFinishedForm,
        usersFinishedForm
    }
}