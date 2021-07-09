exports.getRole = async (req, res, user) => {
    try {
        const roleData = await user.getRoles();
        const role = roleData[0].name;
        return role;
    } catch (err) {
        res.send(err);
    }
}