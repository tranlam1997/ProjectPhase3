const { role } = require('../models');
const db = require('../models');
const User = db.user;

exports.getPermissions = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.send("User not found");
        const data = await user.getPermissions();
        if (!data) return res.send("Error while retrieving user permissions");
        const permissions = data.map(item => item.name);
        res.send(permissions)
    } catch (err) {
        res.send(err);
    }
}

exports.viewPermission = async (req,res) => {
    
}

exports.readPermission = async (req,res) => {
    
}

exports.updatePermission = async (req,res) => {
    
}

exports.deletePermission = async (req,res) => {
    
}


exports.approvePermission = async (req,res) => {
    
}