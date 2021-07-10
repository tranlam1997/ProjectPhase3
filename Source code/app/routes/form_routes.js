module.exports = (router, controller, middleware) => {
    router.get(
        '/user/form/viewAssessment',
        controller.form.viewForm
    );
    router.post('/user/form/createAssessment', middleware.checkRole.isAdminOrHr, controller.form.createForm);
    router.put('/user/form/updateAssessment', controller.form.updateForm);
    router.post('/user/form/submitAssessment', middleware.validateData.validateForm, controller.form.submitForm);
    router.post('/user/form/approveAssessment',middleware.checkRole.isManagerOrDirectorOrAdmin, middleware.checkFormExpiration, controller.form.approveForm);
    router.post('/user/form/closeAssessment',middleware.checkRole.isAdminOrHr,middleware.checkFormExpiration,controller.form.closeForm);
    
    router.get(
        '/user/form/viewProbationary',
        controller.form.viewForm
    );
    router.post('/user/form/createProbationary', middleware.checkRole.isAdminOrHr, controller.form.createForm);
    router.put('/user/form/updateProbationary', controller.form.updateForm);
    router.post('/user/form/submitProbationary',middleware.validateData.validateForm, controller.form.submitForm);
    router.post('/user/form/approveProbationary',middleware.checkRole.isManagerOrDirectorOrAdmin, middleware.checkFormExpiration, controller.form.approveForm);
    router.post('/user/form/closeProbationary',middleware.checkRole.isAdminOrHr,middleware.checkFormExpiration,controller.form.closeForm);
    
}