const db = require('../models');
const bcrypt = require('bcrypt');
const Role = db.role;
const Permission = db.permission;
const Form = db.form;
const functions = require('../functions');
require('dotenv').config();



module.exports = (User, UserInfor) => {
    const register = async (req, res, next) => {
        if (!req.body) {
            res.status(400).send("Content must not be empty");
            return;
        }
        const user = await User.create({
            userName: req.body.userName,
            password: bcrypt.hashSync(req.body.password, parseInt(process.env.CRYPTO_KEY)),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        }).catch(err =>  res.status(500).send("Error while creating user " + err));
        await user.createUserinfor({
            staffId: functions.randomNum(10000, 20000)
        }).catch(err => res.status(500).send("Error while creating user infor " + err));
        const role = await user.createRole({
            nameOfRole: 'employee'
        }).catch(err =>  res.status(500).send("Error while setting role for user " + err));
        console.log(role);
        await user.addRole(role);
        res.status(200).send({
            message: "You registered successfully "
        })
    };

    const logIn = async (req, res) => {
        functions.generateAccessToken(req, res, req.user, req.roles);
        let permissionsOfUser = await req.user.getPermissions().catch(err => res.status(500).send({
            message: `Error while retrieving permissons of user \n ${err}`
        }));
        console.log(permissionsOfUser)
        permissionsOfUser = permissionsOfUser.map(permission => permission.permissionDetail);
        console.log(permissionsOfUser);
        res.status(200).send({
            message: "Log in successfully",
            accessToken: req.accessToken,
            refreshToken: req.refreshToken,
            permissions: `Here is all your permissions : ${permissionsOfUser.join(' ---- ')}`
        });
    }




    const updateUserInfor = async (req, res) => {
        const userId = req.param.id;
        if (!userId) return res.status(400).send('User id not found');
        try {
            const upUser = await UserInfor.findByPk(userId).catch(err => res.status(500).send(`Cannot find user infor ${err}`));
            if (!upUser) return res.status(404).send('User not found');
            upUser.firstName = req.body.firstName;
            upUser.lastName = req.body.lastName;
            upUser.phone = req.body.phone;
            upUser.dateOfBirth = req.body.dateOfBirth;
            upUser.idCard = req.body.idCard;
            upUser.socialInsurance = req.body.socialInsurance;
            upUser.address = req.body.address;
            await upUser.save().catch(err => res.status(500).send("Cannot update user infor " + err));
            res.send(upUser);
        } catch (err) {
            res.send(err);
        }
    }
    const findUser = (req, res) => {
        const id = req.params.id;
        console.log(id);
        console.log(req.user.id);
        if (id != req.user.id) return res.status(403).send({
            message: "forbidden"
        });
        User.findOne({
                where: {
                    id: id
                },
                attributes: {
                    exclude: ['avatar']
                },
                include: [{
                    model: Role
                }, {
                    model: Permission
                }, {
                    model: Form
                }, {
                    model: User,
                    as: "subordinates"
                }]
            })
            .then((data) => {
                res.send(data);
            })
            .catch((err) => {
                res.status(500).send("Error while finding user: " + err);
            });
    };

    const logOut = async (req, res) => {
        const token = req.body.token;
        if (!token)
            return res.send("Token not found");
        try {
            const delToken = await Token.findOne({
                where: {
                    token: token
                }
            });
            if (!delToken)
                return res.status(404).send("Token provided is not valid");
            delToken.destroy();
            res.send("Delete token successfully.");
        } catch (err) {
            res.send(err);
        }
    }

    const deleteUser = async (req, res) => {
        const userId = req.param.id;
        if (!userId) return res.status(400).send('User id not found');
        try {
            const delUser = await User.findByPk(userId);
            if (!delUser) return res.status(404).send('User not found');
            await delUser.destroy();
            res.send("Delele user successfully!");
        } catch (err) {
            res.send(err);
        }
    }

    const manageUser = async (req, res) => {
        if (!req.body) return res.status(400).send({
            message: "You must provide information"
        });
        const {
            subordinateId,
            managerId
        } = req.body;
        if (!subordinateId || !managerId) return res.status(400).send({
            message: "Not enough information"
        });
        const [subordinate, manager] = await Promise.allSettled([User.findByPk(subordinateId), User.findByPk(managerId)]).catch(err => res.status(500).send({
            message: `Error while finding user \n ${err}`
        }));
        if (!subordinate.value || !manager.value) return res.status(404).send({
            message: "Subordinate or manager not found"
        })
        let [suborRole, managerRole] = await Promise.allSettled([subordinate.value.getRoles(), manager.value.getRoles()]).catch(err => res.status(500).send({
            message: `Error while retrieving role \n ${err}`
        }));
        if (!suborRole.value || !managerRole.value) return res.status(404).send({
            message: "Cannot retrieve role"
        });
        const suborRoles = suborRole.value.map(role => role.nameOfRole);
        const managerRoles = managerRole.value.map(role => role.nameOfRole); 
        if(suborRoles.includes('admin') || suborRoles.includes('director')){
            return res.status(400).send({message: 'Not allowed to manage director or admin'});
        } else {
            console.log(managerRoles);
            if(!managerRoles.includes('manager') && !managerRoles.includes('director')){
                return res.status(400).send({message: 'Not allowed to manage other users if you are not director or manager'});

            } else {
                if(suborRoles.includes('hr') || suborRoles.includes('employee')){
                    if(managerRoles.includes('manager')){
                        await manager.value.addSubordinate(subordinate.value).catch(err => res.status(500).send({
                            message: "Can't add subordinate"
                        }));
                        res.status(200).send("Manage user successfully");
                    } else {
                        return res.status(400).send({
                            message: "Employee and Hr must be managed by manager"
                        });
                    }
                } else if(suborRoles.include('manager')){
                    if(managerRoles.include('director')){
                        manager.value.addSubordinates(subordinate.value);
                        res.status(200).send("Manage user successfully")
                    } else {
                        return res.status(400).send({
                            message: "Manager must be managed by director"
                        });
                    }
                } else {
                    return res.status(400).send({
                        message: "Invalid user role"
                    });
                }
            }
        }
    }


    const setRole = async (req, res) => {
        let {
            userId,
            roles
        } = req.body;
        if (!userId || !roles) return res.status(400).send({
            message: `You must provide user id and roles`
        });
        const user = await User.findByPk(userId, {
            include: Role
        }).catch(err => createError(500, `Error while finding users ${err}`));
        if (!user) return res.status(404).send({
            message: "User not found"
        });
        const existedRoles = user.roles.map(role => role.nameOfRole);
        roles = roles.split(/[\s,]+/g).filter(role => ["employee", "manager", "hr", "director", "admin"].includes(role.toLowerCase()))
        if (roles.length == 0) return res.status(400).send({
            message: "You must provide valid roles"
        });
        const notDuplicateRoles = roles.filter(role => !existedRoles.includes(role.toLowerCase()));
        if (notDuplicateRoles.length == 0) return res.status(400).send({
            message: `This user has role of ${roles.join(',')}`
        })
        for (let i = 0; i < roles.length; i++) {
            await user.createRole({
                nameOfRole: roles[i].toLowerCase()
            }).catch(err => res.status(500).send({
                message: `Error while set roles for user ${err}`
            }));
        }
        res.status(200).send({
            message: "Set roles successfully"
        });
    }



    return {
        register,
        logIn,
        updateUserInfor,
        findUser,
        logOut,
        deleteUser,
        manageUser,
        setRole
    };
}