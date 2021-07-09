const db = require('../models');
const bcrypt = require('bcrypt');
const Op = db.Sequelize.Op;
const Role = db.role;
const Permission = db.permission;
const Form = db.form;
const functions = require('../functions');
const role = require('./role.controller');
var createError = require('http-errors')
require('dotenv').config();



module.exports = (User, UserInfor) => {
    const register = async (req, res, next) => {
        if (!req.body) {
            res.status(400).send("Content must not be empty");
            return;
        }
        try {
            const data = await User.create({
                userName: req.body.userName,
                password: bcrypt.hashSync(req.body.password, parseInt(process.env.CRYPTO_KEY)),
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
            });
            await data.createUserinfor({
                staffId: functions.randomNum(10000, 20000)
            }).catch(err => res.status(500).send("Error while creating user infor " + err));
            if (!req.body.role) {
                try {
                    functions.classifyRole(Op, 'employee', Role, Permission, data);
                    res.send("You registered successfully");
                } catch (err) {
                    res.send(err);
                }
            } else {
                try {
                    functions.classifyRole(Op, req.body.role, Role, Permission, data);
                    res.send("You registered successfully");
                } catch (err) {
                    res.send(err);
                }
            }

        } catch (err) {
            res.status(500).send({
                message: err.message || "Internal Server Error"
            });
        }
    };

    const logIn = async (req, res) => {
        try {
            const user = await User.findOne({
                where: {
                    userName: req.body.userName
                }
            });
            if (!user) {
                return res.status(404).send({
                    message: "User Not found."
                });
            }

            functions.checkPass(req, res, user, bcrypt).then(async (valid) => {
                if (!valid) {
                    res.send("Invalid password")
                } else {
                    const userInfor = await user.getUserinfor().catch(err => res.status(500).send({
                        message: "Error while getting user infor" + err
                    }));
                    functions.generateAccessToken(req, res, user, role.getRole(req, res, user), userInfor.staffId, user.email);
                }
            }).catch(err => {
                res.send(err);
            });
        } catch (err) {
            res.status(500).send({
                message: err.message
            });
        };
    };



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
        const [role1, role2] = await Promise.allSettled([subordinate.value.getRoles(), manager.value.getRoles()]).catch(err => res.status(500).send({
            message: `Error while retrieving role \n ${err}`
        }));
        if (!role1.value || !role2.value) return res.status(404).send({
            message: "Cannot retrieve role"
        });
        switch (role1.value[0].name) {
            case "hr":
            case "employee": {
                if (role2.value[0].name === "manager") {
                    console.log(subordinate.value);
                    await manager.value.addSubordinate(subordinate.value).catch(err => res.status(500).send({
                        message: "Can't add subordinate"
                    }));
                    res.status(200).send("Manage user successfully");
                } else return res.status(400).send({
                    message: "Employee and Hr must be managed by manager"
                });
                break;
            }
            case "manager": {
                if (role2.value[0].name === "director") {
                    manager.value.addSubordinates(subordinate.value);
                    res.status(200).send("Manage user successfully")
                } else return res.status(400).send({
                    message: "Manager must be managed by director"
                });
                break;
            }
            default:
                return res.status(400).send({
                    message: "Invalid user role"
                });
        }
    }

    
        const setRole = async (req,res) => {
            const {userId,roles} = req.body;
    
            const user = await User.findByPk(userId).catch(err => createError(500,`Error while finding users ${err}`));
            if(!user) return createError(404,"User not found",{exposed: false});
            for(let i = 0; i < roles.length; i++){
             await user.createRole({name : roles[i]}).catch(err => createError(500,`Error while set roles for user ${err}`));
            }
            res.status(200).send({message: "Set roles successfully"})     
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