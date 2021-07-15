const db = require('../models');
const Permission = db.permission;
const Op = db.Sequelize.Op;
const functions = require('../functions');


const canRead = async (req, res, next) => {
  const permission = await Permission.findOne({
    where: {
      [Op.and]: [{
          roleId: req.user.roleId
        },
        {
          resource: functions.checkResource(req.path)
        }
      ]
    }
  })
  if (permission.read) {
    next();
  } else {
    return res.status(403).send({
      message: 'Access denied. You need READ permission to access this resource'
    });
  }
};


const canWrite = async  (req, res, next) => {
  const permission = await Permission.findOne({
    where: {
      [Op.and]: [{
          roleId: req.user.roleId
        },
        {
          resource: functions.checkResource(req.path)
        }
      ]
    }
  })
  if (permission.write) {
    next();
  } else {
    return res.status(403).send({
      message: 'Access denied. You need WRITE permission to access this resource'
    });
  }
};


const canUpdate = async (req, res, next) => {
  const permission = await Permission.findOne({
    where: {
      [Op.and]: [{
          roleId: req.user.roleId
        },
        {
          resource: functions.checkResource(req.path)
        }
      ]
    }
  })
  if (permission.update) {
    next();
  } else {
    return res.status(403).send({
      message: 'Access denied. You need UPDATE permission to access this resource'
    });
  }
};

const canApprove = async (req, res, next) => {
  const permission = await Permission.findOne({
    where: {
      [Op.and]: [{
          roleId: req.user.roleId
        },
        {
          resource: functions.checkResource(req.path)
        }
      ]
    }
  })
  if (permission.approve) {
    next();
  } else {
    return res.status(403).send({
      message: 'Access denied. You need APPROVE permission to access this resource'
    });
  }
};

const canDelete = async (req, res, next) => {
  const permission = await Permission.findOne({
    where: {
      [Op.and]: [{
          roleId: req.user.roleId
        },
        {
          resource: functions.checkResource(req.path)
        }
      ]
    }
  })
  if (permission.delete) {
    next();
  } else {
    return res.status(403).send({
      message: 'Access denied. You need DELETE permission to access this resource'
    });
  }
};




module.exports = {
  canRead,
  canWrite,
  canUpdate,
  canApprove,
  canDelete
}