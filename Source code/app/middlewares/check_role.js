
const isManager = (req,res,next) => {
  if (req.user.roles.includes("manager")) {
    next();
    return;
  }

  res.status(403).send({
    message: "Not allowed.Require Manager Role!"
  });
  return;
};

const isHr = (req,res,next) => {
  if (req.user.roles.includes("hr")) {
    next();
    return;
  }

  res.status(403).send({
    message: "Not allowed.Require hr Role!"
  });
  return;
};


const isDirector = (req,res,next) => {
  if (req.user.roles.includes("director")) {
    next();
    return;
  }
  res.status(403).send({
    message: "Not allowed.Require director Role!"
  });
  return;
};

const isAdmin = (req,res,next) => {
  if (req.user.roles.includes("admin")) {
    next();
    return;
  }
  res.status(403).send({
    message: "Not allowed.Require admin role!"
  });
  return;
};

const isAdminOrHr = (req,res,next) => {
  if(req.user.roles.includes("admin") || req.user.roles.includes("hr")){
    next();
    return;
  }
  res.status(403).send({
    message: "Not allowed.Require Hr or Admin role"
  });
  return;
};

const isManagerOrDirectorOrAdmin = (req,res,next) => {
  if(req.user.roles.includes("manager")|| req.user.roles.includes("director")|| req.user.roles.includes("admin")){
    next();
    return;
  }
  res.status(403).send({
    message: "Not allowed.Require Manager or Director or Admin role"
  });
  return;
};


module.exports =  {
  isManager,
  isHr,
  isDirector,
  isAdmin,
  isAdminOrHr,
  isManagerOrDirectorOrAdmin
}
