module.exports = (api, controller,middleware) => {
    api.use('/user/report/',middleware.checkPermission.canRead);
    api.get('/user/report/notFinishedAssessmentForm',controller.report.usersNotFinishedForm);
    api.get('/user/report/notFinishedProbationaryForm', controller.report.usersNotFinishedForm);
    api.get('/user/report/finishedAssessmentForm', controller.report.usersFinishedForm);
    api.get('/user/report/finishedProbationaryForm',  controller.report.usersFinishedForm);
}