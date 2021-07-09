const isEmployee = (req, res, next) => {
  if (req.user.role === "employee") {
    next();
    return;
  }
  res.status(403).send({
    message: "Require employee Role!"
  });
  return;
};

const isManager = (req, res, next) => {
  if (req.user.role === "manager") {
    next();
    return;
  }

  res.status(403).send({
    message: "Require Manager Role!"
  });
  return;
};

const isHr = (req, res, next) => {
  if (req.user.role === "hr") {
    next();
    return;
  }

  res.status(403).send({
    message: "Require hr Role!"
  });
  return;
};


const isDirector = (req, res, next) => {
  if (req.user.role === "director") {
    next();
    return;
  }
  res.status(403).send({
    message: "Require director Role!"
  });
  return;
};

const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
    return;
  }
  res.status(403).send({
    message: "Require admin role!"
  });
  return;
};

const isAdminOrHr = (req,res,next) => {
  if(req.user.role === "admin" || req.user.role === "hr"){
    next();
    return;
  }
  res.status(403).send({
    message: "Not allowed"
  });
  return;
}

const isManagerOrDirectorOrAdmin = (req,res,next) => {
  if(req.user.role === "admin" || req.user.role === "manager" || req.user.role === "director"){
    next();
    return;
  }
  res.status(403).send({
    message: "Not allowed"
  });
  return;
}


module.exports = {
  isEmployee ,
  isManager,
  isHr,
  isDirector,
  isAdmin,
  isAdminOrHr,
  isManagerOrDirectorOrAdmin
}