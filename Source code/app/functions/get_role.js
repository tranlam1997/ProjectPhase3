exports.getRoles = (role) => {
    let roles = [];
    if (role.employee)
        roles.push('employee');
    if (role.hr)
        roles.push('hr');
    if (role.manager)
        roles.push('manager');
    if (role.director)
        roles.push('director');
    if (role.admin)
        roles.push('admin');
        return roles;
}