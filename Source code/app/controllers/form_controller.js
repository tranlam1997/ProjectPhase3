const nodemailer = require('nodemailer')
const date = require('date-and-time');
const functions = require('../functions');
let formCategory;
require('dotenv').config();




module.exports = (Form, User, UserInfor, Op) => {
    
    const createForm = async (req, res) => {
        formCategory = functions.checkFormCategory(req.path);
        if (!req.body) {
            res.status(400).send({
                message: 'Not provided enough information'
            })
        }
        const { staffId } = req.body;

        if (!staffId) return res.status(400).send({
            message: 'You must provide staffId'
        });

        if (typeof staffId === 'number') {
            staffId = '' + staffId;
        }

        const staffIds = staffId.split(/[\s,]+/g);
        let forms, notClosedExisted, isDuplicateYear;

        const userInfor = await UserInfor.findAll({
            where: {
                staffId: {
                    [Op.in]: staffIds
                }
            }
        }).catch(err => res.status(500).send({
            message: `Error while finding user infor`,
            error: err.message
        }));
        if (userInfor.length == 0) res.status(404).send({
            message: 'User infor not found'
        });

        const ids = userInfor.map(item => item.userId);
        const users = await User.findAll({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        }).catch(err => res.status(500).send({
            message: `Error while finding user`,
            error: err.message
        }));

        if (!users) return res.status(404).send({
            message: 'User not found'
        });

        const counts = await users.map(item => item.countForms().catch(err => res.status(500).send({
            message: `Error while counting forms.`,
            error: err.message
        })));

        for (let i = 0; i < users.length; i++) {
            if (counts[i] !== 0) {
                forms = await users[i].getForms().catch(err => res.status(500).send({
                    message: `Error while retrieving forms \n`,
                    error: err.message
                }));
                isDuplicateYear = forms.find(obj => obj.timeEnd.getFullYear() === new Date().getFullYear)
                notClosedExisted = forms.find(obj => obj.status !== 'closed');
            }

            if (notClosedExisted) {
                res.status(403).send({
                    message: `User with userId : ${users[i].id}  has form which its status is not closed yet.`
                });
                continue;
            } else {
                if (formCategory === 'assessment') {
                    if (isDuplicateYear) {
                        res.status(401).send({
                            message: 'User only has one assessment form per year'
                        });
                        continue;
                    }
                }
                const now = new Date();
                const data = await users[i].createForm({
                    formCategory: formCategory,
                    userIdOfCreator: req.user.id,
                    staffId: staffIds[i],
                    staffName: users[i].firstName + ' ' + users[i].lastName,
                    status: 'new',
                    timeStart: now,
                    timeEnd: date.addDays(now, 30)
                }).catch(err => res.status(500).send({
                    message: 'Error while creating form ',
                    error: err.message
                }));

                if (!data) return res.status(500).send({ message : 'Can not create form'});
            }

        }
        // Send email to users
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: req.user.email,
                pass: req.body.passEmail
            }
        });

        let mailOptions = {
            from: req.user.email,
            to: users.map(item => item.email).join(','),
            subject: `New ${formCategory} was created`,
            text: 'Check it out'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return res.status(500).send({
                    message: `Error while sending email`,
                    error : error
                });
            } else {
                res.status(200).send({
                    message: `Create ${formCategory} form successfully`,
                    email: `Email sent: ${info.response}`
                });
            }
        });

    }



    const viewForm = async (req, res) => {
        const {
            page,
            size
        } = req.query;
        const {
            limit,
            offset
        } = functions.getPagination(page, size);
        formCategory = functions.checkFormCategory(req.path);
        const roles = req.user.roles;
        if (roles.includes('hr') || roles.includes('admin')) {
            const form = await Form.findAll({
                where: {
                    formCategory: formCategory
                },
                limit,
                offset
            }).catch(err => res.status(500).send({
                message: `Error while finding ${formCategory} form`,
                error : err.message
            }))
            if (form.length == 0) return res.status(404).send({
                message: 'There is no form yet'
            });
            res.send({
                message: 'Retrieve forms successfully',
                forms: form
            });

        } else if (roles.includes('manager') || roles.includes('director')) {
            const manager = await User.findByPk(req.user.id).catch(err => res.status(500).send({
                message: `Error while finding user`,
                error : err.message
            }));
            if (!manager) return res.status(404).send({
                message: 'User not found'
            });
            const subordinate = await manager.getSubordinates().catch(err => res.status(500).send({
                message: `Error while retrieving subordinates`,
                error : err.message
            }));
            if (!subordinate) return res.status(404).send({
                message: 'Subordinates not found'
            });
            const subordinateIds = subordinate.map(item => item.id);
            const form = await Form.findAll({
                where: {
                    [Op.and]: [{
                        userId: {
                            [Op.in]: [req.user.id, subordinateIds]
                        }
                    }, {
                        formCategory: formCategory
                    }]
                },
                limit,
                offset
            }).catch(err => res.status(500).send({
                message: `Error while finding form`,
                error : err.message
            }))
            if (form.length == 0) return res.status(404).send({
                message: 'There is no form yet'
            });
            res.send({
                message: 'Retrieve forms successfully',
                forms: form
            });
        } else if (roles.includes('employee')) {
            const form = await Form.findAll({
                where: {
                    [Op.and]: [{
                        userId: req.user.id
                    }, {
                        formCategory: formCategory
                    }]
                },
                limit,
                offset
            }).catch(err => res.status(500).send({
                message: `Error while finding form`,
                error : err.message
            }))
            if (form.length == 0) return res.status(404).send({
                message: 'There is no form yet'
            });
            res.send({
                message: 'Retrieve forms successfully',
                forms: form
            });

        }
    }



    const submitForm = async (req, res) => {
        formCategory = functions.checkFormCategory(req.path);
        const form = await Form.findOne({
            where: {
                [Op.and]: [{
                    userId: req.user.id
                }, {
                    formCategory: formCategory
                }, {
                    status : 'new'
                }]
            }
        }).catch(err => res.status(500).send({
            message: `Error while finding form`,
            error : err.message
        }));
        if (!form) return res.status(404).send({
            message: 'You do not have any forms yet'
        });
        if (!req.body) res.status(400).send({
            message: 'You must fill in all the fields'
        });
        const data = await form.update({
            unit: req.body.unit,
            position: req.body.position,
            content: req.body.content,
            result: req.body.result,
            proposal: req.body.proposal,
            status: 'submitted',
        }).catch(err => res.status(500).send({
            message: 'Error while submitting form',
            error : err.message
        }));
        if (!data) return res.status(500).send({
            message: 'Can not submit form. Server error'
        });
        res.status(200).send({
            message: 'Submit form successfully'
        });
    };



    const updateForm = async (req, res) => {
        formCategory = functions.checkFormCategory(req.path);
        if (!req.body) return res.status(200).send('You updated nothing');;
        const form = await Form.findOne({
            where: {
                [Op.and]: [{
                    userId: req.user.id
                }, {
                    formCategory: formCategory
                }, {
                    status : 'new'
                }]
            }
        }).catch(err => res.status(500).send({
            message : 'Cannot find form',
            error : err.message
        }))
        if(!form) return res.status(404).send({message : "Form not found"});
        const data = await form.update({
            unit: req.body.unit,
            position: req.body.position,
            content: req.body.content,
            result: req.body.result,
            proposal: req.body.proposal,
            status: 'submitted',
        }).catch(err => res.status(500).send({ 
            message : 'Error while updating form',
            error : err.message
        }));
        if (!data) return res.status(500).send('Can not update form');
        res.status(200).send({ message : 'Update form successfully' });
    }



    const approveForm = async (req, res) => {
        formCategory = functions.checkFormCategory(req.path);
        const form = await Form.findOne({
            where: {
                [Op.and]: [{
                    id: req.query.formId
                }, {
                    status: 'submitted'
                }, {
                    formCategory: formCategory
                }]
            }
        }).catch(err => res.status(500).send({
            message: 'Error while finding form',
            error : err.message
        }));
        if (!form) return res.status(404).send('This form is not in status of submitted yet ');
        const manager = await User.findByPk(req.user.id).catch(err => res.status(500).send({
            message: `Error while finding user`,
            error : err.message
        }));
        if (!manager) return res.status(404).send({
            message: 'User not found'
        });
        const subordinate = await manager.getSubordinates().catch(err => res.status(500).send({
            message: `Error while retrieving subordinates`,
            error : err.message
        }));
        if (subordinate.length == 0) return res.status(404).send({
            message: 'This manager not have any subordinate'
        });
        if (form.userId != subordinate[0].id) return res.status(400).send({
            message: 'You do not have right to approve this staff\'s form'
        });
        form.status = 'approval'
        form.comment = req.body.comment;
        await form.save().catch(err => res.status(500).send({
            message: 'Error while updating status',
            error : err.message
        }));
        res.status(200).send({
            message: 'Approve form successfully'
        });
    }

    const closeForm = async (req, res) => {
        const formId = req.query.formId;
        const form = await Form.findByPk(formId).catch(err => res.status(500).send({
            message: `Error while finding form`,
            error : err.message
        }));
        if (!form) return res.status(404).send({
            message: 'Form not found'
        });
        if (form.formCategory != formCategory) return res.status(400).send({
            message: 'You chose wrong form'
        });
        if (req.user.id != form.userIdOfCreator) return res.status(400).send({
            message: 'Form is not created by this user'
        });
        form.status = 'closed';
        await form.save().catch(err => res.status(500).send({
            message: `Error while changing status of form`,
            error : err.message
        }));
        res.status(200).send({
            message: 'Close form successfully'
        });
    }

    
    return {
        updateForm,
        submitForm,
        viewForm,
        approveForm,
        createForm,
        closeForm
    };
}