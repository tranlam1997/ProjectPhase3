module.exports = (Form, User, UserInfor, formCategory, Op) => {
    const listUserNotFinishedForm = async (req, res) => {
        const forms = await Form.findAll({
            where: {
                [Op.and]: [{
                    status: {
                        [Op.not]: "closed"
                    }
                }, {
                    timeEnd: {
                        [Op.gt]: new Date()
                    }
                }, {
                    formCategory: formCategory
                }]
            },
            include: User
        }).catch(err => res.status(500).send({
            message: `Error while finding form \n ${err}`
        }));
        if (forms.length == 0) return res.status(404).send({
            message: "All users finished their form"
        });
        console.log(forms[0].user.userName)
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

    const listUserFinishedForm = async (req, res) => {
        const forms = await Form.findAll({
            where: {
                [Op.and]: [{
                    status: "closed"

                }, {
                    timeEnd: {
                        [Op.gt]: new Date()
                    }
                }, {
                    formCategory: formCategory
                }]
            },
            include: User
        }).catch(err => res.status(500).send({
            message: `Error while finding form \n ${err}`
        }));
        if (forms.length == 0) return res.status(404).send({
            message: `All users not finished their ${formCategory} form`
        });
        console.log(forms[0].user.userName)
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
        listUserNotFinishedForm,
        listUserFinishedForm
    }
}