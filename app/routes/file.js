const filesController = require("../controllers/file.controller");
const upload = require("../middlewares/upload");
const {deleteFile} = require("../middlewares/deleteFile");


module.exports = (router) => {
  router.post("user/uploadAvatar/:id", upload.single("file"), filesController.uploadFiles);
  router.put("user/updateAvatar/:id", deleteFile ,upload.single("file"), filesController.uploadFiles);
}