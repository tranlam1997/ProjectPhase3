module.exports = (router, controller, middleware) => {
    router.post(
        "/register",
        middleware.validateData.validateUser,
        middleware.checkExistence.checkDuplicateUserNameOrEmail,
        controller.user.register
    );
    router.post("/logIn", controller.user.logIn);
    router.post("/user/setRole",middleware.checkRole.isAdmin,controller.user.setRole)
    router.delete("/user/delete", controller.user.deleteUser);
    router.put("/user/updateInfor", middleware.checkRole.isAdmin, controller.user.updateUserInfor);
    router.post("/user/manageUser",middleware.checkRole.isAdmin, controller.user.manageUser);
    router.get("/user/getApi", controller.permission.getPermissions);
    router.get("/user/:id/find", controller.user.findUser);
}