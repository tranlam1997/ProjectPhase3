

module.exports = (router, controller, middleware) => {
    router.get(
        "/user/form/viewAssessmentForm",
        controller.form.viewForm
    );
    router.post("/user/form/createAssessmentForm", middleware.checkRole.isAdminOrHr, controller.form.createForm);
    router.put("/user/form/updateAssessmentForm", controller.form.updateForm);
    router.post("/user/form/submitAssessmentForm", controller.form.submitForm);
    router.post("/user/form/approveAssessmentForm",middleware.checkRole.isManagerOrDirectorOrAdmin, middleware.checkFormExpiration, controller.form.approveForm);
    router.post("/user/form/closeAssessmentForm",middleware.checkRole.isAdminOrHr,middleware.checkFormExpiration,controller.form.closeForm);
    
    router.get(
        "/user/form/viewProbationarytForm",
        controller.form.viewForm
    );
    router.post("/user/form/createProbationaryForm", middleware.checkRole.isAdminOrHr, controller.form.createForm);
    router.put("/user/form/updateProbationaryForm", controller.form.updateForm);
    router.post("/user/form/submitProbationaryForm", controller.form.submitForm);
    router.post("/user/form/approveProbationaryForm",middleware.checkRole.isManagerOrDirectorOrAdmin, middleware.checkFormExpiration, controller.form.approveForm);
    router.post("/user/form/closeProbationaryForm",middleware.checkRole.isAdminOrHr,middleware.checkFormExpiration,controller.form.closeForm);
    
}