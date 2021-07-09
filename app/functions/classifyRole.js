exports.classifyRole = async (Op, roles, Role, Permission, user) => {
    const role = roles.toLowerCase();
    switch (role) {
        case 'employee': {
            const employeeRole = await Role.findOne({
                where: {
                    name: role
                }
            });
            const permissions = await Permission.findAll({
                where: {
                    name: {
                        [Op.in]: ['read', 'update']
                    }
                }
            });
            user.addPermission(permissions);
            user.addRole(employeeRole);
            break;
        }
        case 'manager': {

            const managerRole = await Role.findOne({
                where: {
                    name: role
                }
            });
            const permissions = await Permission.findAll({
                where: {
                    name: {
                        [Op.in]: ['read', 'update', 'approve']
                    }
                }
            });
            user.addPermission(permissions);
            user.addRole(managerRole);

            break;

        }
        case 'hr': {

            const hrRole = await Role.findOne({
                where: {
                    name: role
                }
            });
            const permissions = await Permission.findAll({
                where: {
                    name: {
                        [Op.in]: ['read', 'update', 'write']
                    }
                }
            });
            user.addPermission(permissions);
            user.addRole(hrRole);

            break;

        }
        case 'director': {

            const directorRole = await Role.findOne({
                where: {
                    name: role
                }
            });
            const permissions = await Permission.findAll({
                where: {
                    name: {
                        [Op.in]: ['read', 'update', 'write', 'approve']
                    }
                }
            });
            user.addPermission(permissions);
            user.addRole(directorRole);
            break;

        }
        case 'admin': {

            const adminRole = await Role.findOne({
                where: {
                    name: role
                }
            });
            const permissions = await Permission.findAll({
                where: {
                    name: {
                        [Op.in]: ['read', 'update', 'write', 'approve', 'delete']
                    }
                }
            });
            user.addPermission(permissions);
            user.addRole(adminRole);
            break;

        }
        default: {
            const defaultRole = await Role.findOne({
                where: {
                    name: 'employee'
                }
            });
            const permissions = await Permission.findAll({
                where: {
                    name: {
                        [Op.in]: ['read', 'update']
                    }
                }
            });
            user.addPermission(permissions);
            user.addRole(defaultRole);
            break;
        }
    }
}