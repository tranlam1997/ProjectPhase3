
exports.initialRole = (Role) => {
    Role.create({
      id: 1,
      name: "employee"
    });
   
    Role.create({
      id: 2,
      name: "manager"
    });
   
    Role.create({
      id: 3,
      name: "hr"
    });

    Role.create({
      id: 4,
      name: "director"
    });

    Role.create({
      id: 5,
      name: "admin"
    })
  }

  exports.initialPermission = (Permission) => {
    Permission.create({
      id: 1,
      name: "read"
    });
   
    Permission.create({
      id: 2,
      name: "write"
    });
   
    Permission.create({
      id: 3,
      name: "update"
    });

    Permission.create({
      id: 4,
      name: "delete"
    });

    Permission.create({
      id: 5,
      name: "approve"
    })
  }
 
 
