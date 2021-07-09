const nodemailer = require('nodemailer')
const date = require('date-and-time');
require('dotenv').config();




module.exports = (Form, User, UserInfor, formCategory, Op) => {
    const createForm = async (req, res) => {
        if (!req.body) {
            res.status(400).send("Not provided enough information")
        }
        const { staffId } = req.body;

        if (!staffId) return res.status(400).send("You must provide staffId");

        if (typeof staffId === number) {
            staffId = "" + staffId;
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
            message: `Error while finding user infor. \n ${err}`
        }));

        if (!userInfor) res.status(404).send({
            message: "User infor not found"
        });

        const ids = userInfor.map(item => item.userId);
        const users = await User.findAll({
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        }).catch(err => res.status(500).send({
            message: `Error while finding user \n ${err}`
        }));

        if (!users) return res.status(404).send({
            message: "User not found"
        });

        const counts = await users.map(item => item.countForms().catch(err => res.status(500).send({
            message: `Error while counting forms. \n ${err}`
        })));

        for (let i = 0; i < users.length; i++) {
            if (counts[i] !== 0) {
                forms = await users[i].getForms().catch(err => res.status(500).send({
                    message: `Error while retrieving forms \n ${err}`
                }));
                isDuplicateYear = forms.find(obj => obj.timeEnd.getFullYear() === new Date().getFullYear)
                notClosedExisted = forms.find(obj => obj.status !== "closed");
            }

            if (notClosedExisted) {
                res.status(403).send({
                    message: `User with userId : ${users[i].id}  has form which its status is not closed yet.`
                });
                continue;
            } else {
                if (formCategory === "assessment") {
                    if (isDuplicateYear) {
                        res.status(401).send({
                            message: "User only has one assessment form per year"
                        });
                        continue;
                    }
                }
                const now = new Date();
                const data = await users[i].createForm({
                    formCategory: formCategory,
                    creator: req.user.id,
                    staffId: staffIds[i],
                    staffName: users[i].firstName + " " + users[i].lastName,
                    status: "new",
                    timeStart: now,
                    timeEnd: date.addDays(now, 30)
                }).catch(err => res.status(500).send("Error while creating form " + err));
                
                if (!data) return res.status(500).send("Can't create form");
            }

        }

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: req.user.email,
                pass: 'lamngo123'
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
                res.status(500).send({
                    message: `Error while sending email  ${error}`
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
        const role = req.user.role;
        if (role == "hr" || role == "admin") {
            const form = await Form.findAll().catch(err => res.status(500).send({
                message: `Error while finding form \n ${err}`
            }))
            if (!form) return res.status(404).send({
                message: "Form not found"
            });
            res.send({
                message: "Retrieve forms successfully",
                forms: form
            });

        } else if (role == "employee") {
            const form = await Form.findAll({
                where: {
                    userId: req.user.id
                }
            }).catch(err => res.status(500).send({
                message: `Error while finding form \n ${err}`
            }))
            if (!form) return res.status(404).send({
                message: "Form not found"
            });
            res.send({
                message: "Retrieve forms successfully",
                forms: form
            });

        } else if (role == "manager" || role == "director") {
            const manager = await User.findByPk(req.user.id).catch(err => res.status(500).send({
                message: `Error while finding user \n ${err}`
            }));
            if (!manager) return res.status(404).send({
                message: "User not found"
            });
            const subordinate = await manager.getSubordinates().catch(err => res.status(500).send({
                message: `Error while retrieving subordinates \n ${err}`
            }));
            if (!subordinate) return res.status(404).send({
                message: "Subordinates not found"
            });
            const subordinateIds = subordinate.map(item => item.id);
            const form = await Form.findAll({
                where: {
                    userId: {
                        [Op.in]: [req.user.id, subordinateIds]
                    }
                }
            }).catch(err => res.status(500).send({
                message: `Error while finding form \n ${err}`
            }))
            if (!form) return res.status(404).send({
                message: "Form not found"
            });
            res.send({
                message: "Retrieve forms successfully",
                forms: form
            });
        }
    }

    const submitForm = async (req, res) => {
        const form = await Form.findOne({
            where: {
                userId: req.user.id
            }
        }).catch(err => res.status(500).send({
            message: `Error while finding form \n ${err}`
        }));
        if (!form) return res.status(404).send({
            message: "You don't have any forms yet"
        });
        if (!req.body) res.status(400).send({
            message: "You must fill in all the fields"
        });
        const data = await form.update({
            agency: req.body.agency,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email,
            qualification: req.body.qualification,
            unit: req.body.unit,
            position: req.body.position,
            contentAssessment: req.body.contentAssessment,
            assessmentResult: req.body.assessmentResult,
            probationaryResult: req.body.probationaryResult,
            proposal: req.body.proposal,
            signature: req.body.signature,
            status: "submitted",
        }).catch(err => res.status(500).send({
            message: "Error while submitting form \n" + err
        }));
        if (!data) return res.status(500).send({
            message: "Can't submit form. Server error"
        });
        res.status(200).send({
            message: "Submit form successfully"
        });
    };



    const updateForm = async (req, res) => {
        if (!req.body) return res.status(200).send("You updated nothing");
        const form = await Form.findOne({
            where: {
                userId: req.user.id
            }
        })
        const data = await form.update({
            agency: req.body.agency,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email,
            qualification: req.body.qualification,
            unit: req.body.unit,
            position: req.body.position,
            contentAssessment: req.body.contentAssessment,
            assessmentResult: req.body.assessmentResult,
            probationaryResult: req.body.probationaryResult,
            proposal: req.body.proposal,
            signature: req.body.signature,
            status: "submitted",
        }).catch(err => res.status(500).send("Error while updating form " + err));
        if (!data) return res.status(500).send("Can't update form");
        res.status(200).send("Update form successfully");
    }

    const approveForm = async (req, res) => {
        const form = await Form.findOne({
            where: {
                [Op.and]: [{
                    id: req.query.formId
                }, {
                    status: "submitted"
                }, {
                    formCategory: formCategory
                }]
            }
        }).catch(err => res.status(500).send({
            message: "Error while finding form " + err
        }));
        if (!form) return res.status(404).send("This form is not in status of submitted yet ");
        const manager = await User.findByPk(req.user.id).catch(err => res.status(500).send({
            message: `Error while finding user \n ${err}`
        }));
        if (!manager) return res.status(404).send({
            message: "User not found"
        });
        const subordinate = await manager.getSubordinates().catch(err => res.status(500).send({
            message: `Error while retrieving subordinates \n ${err}`
        }));
        if (subordinate.length == 0) return res.status(404).send({
            message: "This manager not have any subordinate"
        });
        if (form.userId != subordinate[0].id) return res.status(400).send({
            message: "You don't have right to approve this staff's form"
        });
        form.status = "approval"
        form.comment = req.body.comment;
        await form.save().catch(err => res.status(500).send({
            message: "Error while updating status " + err
        }));
        res.status(200).send({
            message: "Approve form successfully"
        })
    }

    const closeForm = async (req, res) => {
        const formId = req.query.formId;
        const form = await Form.findByPk(formId).catch(err => res.status(500).send({
            message: `Error while finding form \n ${err}`
        }));
        if (!form) return res.status(404).send({
            message: "Form not found"
        });
        if (form.formCategory != formCategory) return res.status(400).send({
            message: "You chose wrong form"
        });
        if (req.user.id != form.creator) return res.status(400).send({
            message: "Form is not created by this user"
        });
        form.status = "closed";
        await form.save().catch(err => res.status(500).send({
            message: `Error while changing status of form \n ${err}`
        }));
        res.status(200).send({
            message: "Close form successfully"
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