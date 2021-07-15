const bcrypt = require('bcrypt');
const functions = require('../functions');
require('dotenv').config();



module.exports = (User, UserInfor, Form, Permission, Role) => {

    const register = async (req, res) => {
        if (!req.body) {
            res.status(400).send('Content must not be empty');
            return;
        }
        const user = await User.create({
            userName: req.body.userName,
            password: bcrypt.hashSync(req.body.password, parseInt(process.env.CRYPTO_KEY)),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        }).catch(err => res.status(500).send({
            message: 'Error while creating user',
            error: err.message
        }));
        await user.createUserinfor({
            staffId: functions.randomNum(10000, 20000)
        }).catch(err => res.status(500).send({
            message: 'Error while creating user infor',
            error: err.message
        }));
        await user.createRole({
            employee: true
        }).catch(err => res.status(500).send({
            message: 'Error while setting role for user',
            error: err.message
        }));
        try {
            await functions.setPermission(Role, Permission, user);
        } catch (err) {
            res.status(500).send({
                error: err.message
            });
        }
        res.status(200).send({
            message: 'You registered successfully '
        })
    };

    const logIn = async (req, res) => {
        const role = await Role.findOne({
            where: {
                userId: req.user.id
            }
        }).catch(err => res.status(500).send({
            message: 'Error while retrieving role',
            error: err.message
        }));

        const accessToken = functions.generateAccessToken(req.user, role, functions.getRoles(role));
        res.status(200).send({
            message: 'Log in successfully',
            accessToken: accessToken
        });
    }




    const updateUserInfor = async (req, res) => {
        const userId = req.user.id;
        const [user, userInfor] = await Promise.allSettled([User.findByPk(userId), UserInfor.findOne({
            where: {
                userId: userId
            }
        })]).catch(err => res.status(500).send({
            message: 'Cannot find user infor',
            error: err.message
        }));
        if (!user.value || !userInfor.value) return res.status(404).send({
            message: 'User not found'
        });
        
        await Promise.allSettled([user.value.update({
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }), userInfor.value.update({
            phone : req.body.phone,
            dateOfBirth : req.body.dateOfBirth,
            idCard : req.body.idCard,
            socialInsurance : req.body.socialInsurance,
            address : req.body.address
        })]).catch(err => res.status(500).send({
            message: 'Cannot update user infor',
            error: err.message
        }));
        await userInfor.value.save();
        res.status(200).send({
            message: 'Update infor successfully'
        });
    }


    const findAllUser = (req, res) => {
        const {
            page,
            size
        } = req.query;
        const {
            limit,
            offset
        } = functions.getPagination(page, size);
        User.findAll({
                include: [{
                        model: Role,
                        include: [{
                            model: Permission
                        }]
                    }, {
                        model: Form
                    }, {
                        model: User,
                        as: 'subordinates'
                    },
                    {
                        model: UserInfor,
                        attributes: {
                            exclude: ['avatar']
                        }
                    }
                ],
                limit,
                offset
            })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send({
                    message: 'Error while finding user',
                    error: err.message
                });
            });
    };



    const deleteUser = async (req, res) => {
        const userId = req.user.id;
        if (!userId) return res.status(400).send('User id not found');
        const [user, userInfor, role] = await Promise.allSettled([User.findByPk(userId), UserInfor.findOne({
            where: {
                userId: userId
            }
        }), Role.findOne({
            where: {
                userId: userId
            }
        })]).catch(err => res.status(500).send({
            message: `Error while finding user`,
            error: err.message
        }));
        if (!user.value || !userInfor.value) return res.status(404).send({
            message: 'User not found'
        });
        const permission = await Permission.findAll({
            where: {
                roleId: role.value.id
            }
        }).catch(err => res.status(500).send({
            message: 'Error while retrieving permission',
            error: err.message
        }));

        permission.forEach(async (data) => await data.destroy().catch(err => res.status(500).send({
            message: 'Error while removing permission',
            error: err.message
        })))
        await Promise.allSettled([user.value.destroy(), userInfor.value.destroy(), role.value.destroy()]).catch(err => res.status(500).send({
            message: 'Error while removing user',
            error: err.message
        }));

        res.status(200).send({
            message: 'Delele user successfully!'
        });
    }



    const manageUser = async (req, res) => {
        if (!req.body) return res.status(400).send({
            message: 'You must provide information'
        });
        const {
            subordinateId,
            managerId
        } = req.body;
        if (!subordinateId || !managerId) return res.status(400).send({
            message: 'Not enough information'
        });
        const [subordinate, manager] = await Promise.allSettled([User.findByPk(subordinateId), User.findByPk(managerId)]).catch(err => res.status(500).send({
            message: `Error while finding user`,
            error: err.message
        }));
        if (!subordinate.value || !manager.value) return res.status(404).send({
            message: 'Subordinate or manager not found'
        })
        let [suborRole, managerRole] = await Promise.allSettled([subordinate.value.getRole(), manager.value.getRole()]).catch(err => res.status(500).send({
            message: `Error while retrieving role`,
            error: err.message
        }));
        if (!suborRole.value || !managerRole.value) return res.status(404).send({
            message: 'Cannot retrieve role'
        });
        const suborRoles = suborRole.value;
        const managerRoles = managerRole.value;
        if (suborRoles.admin || suborRoles.director) {
            return res.status(400).send({
                message: 'Not allowed to manage director or admin'
            });
        } else {
            if (!managerRoles.manager && !managerRoles.director) {
                return res.status(400).send({
                    message: 'Not allowed to manage other users if you are not director or manager'
                });

            } else {
                if (suborRoles.hr || suborRoles.employee) {
                    if (managerRoles.manager) {
                        await manager.value.addSubordinate(subordinate.value).catch(err => res.status(500).send({
                            message: 'Can not add subordinate'
                        }));
                        res.status(200).send({message : 'Manage user successfully'});
                    } else {
                        return res.status(400).send({
                            message: 'Employee and Hr must be managed by manager'
                        });
                    }
                } else if (suborRoles.manager) {
                    if (managerRoles.director) {
                        manager.value.addSubordinates(subordinate.value);
                        res.status(200).send({
                            message: 'Manage user successfully'
                        })
                    } else {
                        return res.status(400).send({
                            message: 'Manager must be managed by director'
                        });
                    }
                } else {
                    return res.status(400).send({
                        message: 'Invalid user role'
                    });
                }
            }
        }
    }


    const setRole = async (req, res) => {
        let {
            userId,
            role
        } = req.body;
        if (!userId || !role) return res.status(400).send({
            message: `You must provide user id and role`
        });
        const user = await User.findByPk(userId).catch(err => res.status(500).send({
            message: 'Error while finding user',
            error: err.message
        }));
        if (!user) return res.status(404).send({
            message: 'User not found'
        });
        if (!['employee', 'manager', 'hr', 'director', 'admin'].includes(role.toLowerCase())) return res.status(400).send({
            message: 'You must provide valid role'
        });
        const roleOfUser = await Role.findOne({
            where: {
                userId: userId
            }
        })
        if (role === 'hr') {
            await roleOfUser.update({
                hr: 1
            }).catch(err => res.status(500).send({
                message: `Error while set roles for user`,
                error: err.message
            }));
        } else if (role === 'manager') {
            await roleOfUser.update({
                manager: 1
            }).catch(err => res.status(500).send({
                message: `Error while set roles for user`,
                error: err.message
            }));
        } else if (role === 'director') {
            await roleOfUser.update({
                director: 1
            }).catch(err => res.status(500).send({
                message: `Error while set roles for user`,
                error: err.message
            }));
        } else {
            await roleOfUser.update({
                admin: 1
            }).catch(err => res.status(500).send({
                message: `Error while set role for user`,
                error: err.message
            }));
        }
        try {
            await functions.setPermission(Role, Permission, user);
        } catch (err) {
            res.status(500).send({
                error: err.message
            });
        }
        res.status(200).send({
            message: 'Set roles successfully'
        });
    }


    return {
        register,
        logIn,
        updateUserInfor,
        findAllUser,
        deleteUser,
        manageUser,
        setRole
    };
}