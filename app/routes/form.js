

module.exports = (router, controller, middleware) => {
    router.get(
        "/user/form/viewAssessmentForm",
        controller.assessmentForm.viewForm
    );
    router.post("/user/form/createAssessmentForm", middleware.checkRole.isAdminOrHr, controller.assessmentForm.createForm);
    router.put("/user/form/updateAssessmentForm", controller.assessmentForm.updateForm);
    router.post("/user/form/submitAssessmentForm", controller.assessmentForm.submitForm);
    router.post("/user/form/approveAssessmentForm",middleware.checkRole.isManagerOrDirectorOrAdmin, middleware.checkExpiration, controller.assessmentForm.approveForm);
    router.post("/user/form/closeAssessmentForm",middleware.checkRole.isAdminOrHr,middleware.checkExpiration,controller.assessmentForm.closeForm);
    
    router.get(
        "/user/form/viewProbationarytForm",
        controller.probationaryForm.viewForm
    );
    router.post("/user/form/createProbationaryForm", middleware.checkRole.isAdminOrHr, controller.probationaryForm.createForm);
    router.put("/user/form/updateProbationaryForm", controller.probationaryForm.updateForm);
    router.post("/user/form/submitProbationaryForm", controller.probationaryForm.submitForm);
    router.post("/user/form/approveProbationaryForm",middleware.checkRole.isManagerOrDirectorOrAdmin, middleware.checkExpiration, controller.probationaryForm.approveForm);
    router.post("/user/form/closeProbationaryForm",middleware.checkRole.isAdminOrHr,middleware.checkExpiration,controller.probationaryForm.closeForm);
    
}