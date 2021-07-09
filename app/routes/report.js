
module.exports = (router, controller, middleware) => {
    router.get("/user/report/reportAssessmentFormNotFinished", middleware.checkRole.isHr, controller.reportAssessmentForm.listUserNotFinishedForm);
    router.get("/user/report/reportProbationaryFormNotFinished", middleware.checkRole.isHr, controller.reportProbationaryForm.listUserNotFinishedForm);
    router.get("/user/report/reportAssessmentFormFinished", middleware.checkRole.isHr, controller.reportAssessmentForm.listUserFinishedForm);
    router.get("/user/report/reportProbationaryFormFinished", middleware.checkRole.isHr, controller.reportProbationaryForm.listUserFinishedForm);
    
}