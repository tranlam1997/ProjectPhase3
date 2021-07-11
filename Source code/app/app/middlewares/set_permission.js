const db = require('../models');
const functions = require('../functions');
const Op = db.Sequelize.Op;
const User = db.user;
const Role = db.role;
const Permission = db.permission;

const setPermission = async (req, res, next) => {
    const user = req.user;
    const rolesOfUser = user.roles.map(role => role.nameOfRole);
    for (let i = 0; i < rolesOfUser.length; i++) {
        switch (rolesOfUser[i]) {
            case 'employee': {
                await user.setPermissions([]);
                await Permission.destroy({
                    where: {
                        userId: {
                            [Op.is]: null
                        }
                    }

                }).catch(err => res.status(500).send({
                    message: `Error when removing permission`,
                    error: err
                }));
                await functions.createPermission(user, 'employee').catch(err => res.status(500).send({
                    message: `Cannot create permission for employee`,
                    err: err
                }));
                break;
            }
            case 'manager': {
                await user.setPermissions([]);
                await Permission.destroy({
                    where: {
                        userId: {
                            [Op.is]: null
                        }
                    },

                }).catch(err => res.status(500).send({
                    message: `Error when removing permission`,
                    error: err
                }));
                await functions.createPermission(user, 'employee').catch(err => res.status(500).send({
                    message: `Cannot create permission for employee`,
                    err: err
                }));;
                await functions.createPermission(user, 'manager').catch(err => res.status(500).send({
                    message: `Cannot create permission for manager`,
                    err: err
                }));;
                break;
            }
            case 'director': {
                await user.setPermissions([]);
                await Permission.destroy({
                    where: {
                        userId: {
                            [Op.is]: null
                        }
                    },

                }).catch(err => res.status(500).send({
                    message: `Error when removing permission`,
                    error: err
                }));
                await functions.createPermission(user, 'employee').catch(err => res.status(500).send({
                    message: `Cannot create permission for employee`,
                    err: err
                }));;
                await functions.createPermission(user, 'manager').catch(err => res.status(500).send({
                    message: `Cannot create permission for manager`,
                    err: err
                }));;
                await functions.createPermission(user, 'hr').catch(err => res.status(500).send({
                    message: `Cannot create permission for hr`,
                    err: err
                }));;
                break;
            }
            case 'hr': {
                user.setPermissions([]);
                await Permission.destroy({
                    where: {
                        userId: {
                            [Op.is]: null
                        }
                    },

                }).catch(err => res.status(500).send({
                    message: `Error when removing permission`,
                    error: err
                }));
                await functions.createPermission(user, 'employee').catch(err => res.status(500).send({
                    message: `Cannot create permission for employee`,
                    err: err
                }));;
                await functions.createPermission(user, 'hr').catch(err => res.status(500).send({
                    message: `Cannot create permission for hr`,
                    err: err
                }));;
                break;
            }
            case 'admin': {
                await user.setPermissions([]);
                await Permission.destroy({
                    where: {
                        userId: {
                            [Op.is]: null
                        }
                    },

                }).catch(err => res.status(500).send({
                    message: `Error when removing permission`,
                    error: err
                }));
                await functions.createPermission(user, 'employee').catch(err => res.status(500).send({
                    message: `Cannot create permission for employee`,
                    err: err
                }));;
                await functions.createPermission(user, 'manager').catch(err => res.status(500).send({
                    message: `Cannot create permission for manager`,
                    err: err
                }));;
                await functions.createPermission(user, 'hr').catch(err => res.status(500).send({
                    message: `Cannot create permission for hr`,
                    err: err
                }));;
                break;
            }
        }
    }
    req.roles = rolesOfUser;
    next();
}

module.exports = {
    setPermission
}