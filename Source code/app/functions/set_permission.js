
exports.setPermission = async (Role, Permission, user) => {
    try {
        const role = await Role.findOne({
            where: {
                userId: user.id
            }
        });
        let permission = await Permission.findAll({
            where: {
                roleId: role.id
            }
        });
        if (permission.length == 0) {
            await Permission.bulkCreate([{
                roleId: role.id,
                resource: 'userInfor'
            }, {
                roleId: role.id,
                resource: 'form'
            }, {
                roleId: role.id,
                resource: 'report'
            }])
            permission = await Permission.findAll({
                where: {
                    roleId: role.id
                }
            });
        }
        if (role.employee) {
            for (let item of permission) {
                if (item.resource === 'userInfor') {
                    await item.update({
                        read: true,
                        update: true,
                        delete: true
                    })
                } else if (item.resource === 'form') {
                    await item.update({
                        read: true,
                        update: true,
                        write: true
                    })
                }
            }
        }
        if (role.hr) {
            for (let item of permission) {
                if (item.resource === 'userInfor') {
                    await item.update({
                        read: true,
                        update: true,
                        delete: true
                    })
                } else if (item.resource === 'form') {
                    await item.update({
                        read: true,
                        update: true,
                        write: true
                    })
                } else {
                    await item.update({
                        read: true
                    })
                }
            }
        }
        if (role.manager) {
            for (let item of permission) {
                if (item.resource === 'userInfor') {
                    await item.update({
                        read: true,
                        update: true,
                        delete: true
                    })
                } else if (item.resource === 'form') {
                    await item.update({
                        read: true,
                        update: true,
                        approve: true
                    })
                }
            }
        }
        if (role.director) {
            for (let item of permission) {

                if (item.resource === 'userInfor') {
                    await item.update({
                        read: true,
                        update: true,
                        delete: true
                    })
                } else if (item.resource === 'form') {
                    await item.update({
                        read: true,
                        update: true,
                        approve: true
                    })
                }
            }
        }
        if (role.admin) {
            for (let item of permission) {

                if (item.resource === 'userInfor') {
                    await item.update({
                        read: true,
                        update: true,
                        delete: true
                    })
                } else if (item.resource === 'form') {
                    await item.update({
                        read: true,
                        update: true,
                        write: true
                    })
                }
            }

        }
    } catch (err) {
        throw new Error(err.mesage);
    }
}

