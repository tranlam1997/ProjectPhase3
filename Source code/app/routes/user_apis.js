module.exports = (api, controller, middleware) => {
    api.post(
        '/register',
        middleware.validateData.validateUser,
        middleware.checkDuplicateUser,
        controller.user.register
    );
    api.post(
        '/logIn',
        middleware.checkLogIn,
        controller.user.logIn
    );

    api.post(
        '/user/setRole',
        middleware.checkRole.isAdmin,
        controller.user.setRole
    );

    api.put(
        '/user/infor/update',
        middleware.checkPermission.canUpdate,
        middleware.validateData.validateUserInfor,
        controller.user.updateUserInfor
    );

    api.post(
        '/user/manage',
        middleware.checkRole.isAdmin,
        controller.user.manageUser
    );

    api.delete(
        '/user/infor/delete',
        middleware.checkPermission.canDelete,
        controller.user.deleteUser
    );


    api.get('/user/findAll',middleware.checkRole.isAdmin, controller.user.findAllUser);

    api.post(
        '/user/infor/uploadAvatar',
        middleware.checkPermission.canUpdate,
        middleware.uploadFile.single('file'),
        controller.upload.uploadFile
    );

    api.put(
        '/user/infor/updateAvatar',
        middleware.checkPermission.canUpdate,
        middleware.deleteFile,
        middleware.uploadFile.single('file'),
        controller.upload.uploadFile
    );

}