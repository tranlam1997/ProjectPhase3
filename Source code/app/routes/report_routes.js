
module.exports = (router, controller) => {
    router.get("/user/report/usersNotFinishedAssessmentForm",controller.report.usersNotFinishedForm);
    router.get("/user/report/usersNotFinishedProbationaryForm", controller.report.usersNotFinishedForm);
    router.get("/user/report/usersFinishedAssessmentForm", controller.report.usersFinishedForm);
    router.get("/user/report/usersFinishedProbationaryForm",  controller.report.usersFinishedForm);
    
}