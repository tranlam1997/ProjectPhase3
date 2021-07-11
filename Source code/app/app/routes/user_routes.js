module.exports = (router, controller, middleware) => {
    router.post(
        '/register',
        middleware.validateData.validateUser,
        middleware.checkDuplicateUser,
        controller.user.register
    );
    router.post(
        '/logIn',
        middleware.checkLogIn,
        middleware.setPermission,
        controller.user.logIn
    );

    router.post(
        '/user/setRole',
        middleware.checkRole.isAdmin,
        controller.user.setRole
    );

    router.put(
        '/user/updateInfor',
        middleware.validateData.validateUserInfor,
        controller.user.updateUserInfor
    );

    router.post(
        '/user/manage',
        middleware.checkRole.isAdmin,
        controller.user.manageUser
    );

    router.delete(
        '/user/:id/delete',
        controller.user.deleteUser
    );

    router.get('/user/:id/find', controller.user.findUser);

    router.post(
        '/user/:id/updateInfor/uploadAvatar',
        middleware.uploadFile.single('file'),
        controller.upload.uploadFile
    );

    router.put(
        '/user/:id/updateInfor/updateAvatar',
        middleware.deleteFile,
        middleware.uploadFile.single('file'),
        controller.upload.uploadFile
    );
    
}