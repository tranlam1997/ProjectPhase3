module.exports = (router, controller,middleware) => {
    router.use('/user/report',middleware.checkRole.isHr);
    router.get('/user/report/notFinishedAssessmentForm',controller.report.usersNotFinishedForm);
    router.get('/user/report/notFinishedProbationaryForm', controller.report.usersNotFinishedForm);
    router.get('/user/report/finishedAssessmentForm', controller.report.usersFinishedForm);
    router.get('/user/report/finishedProbationaryForm',  controller.report.usersFinishedForm);
    
}