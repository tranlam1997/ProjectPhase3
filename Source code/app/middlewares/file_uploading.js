const multer = require('multer');
const path = require('path');

const imageFilter = (req, file, cb) => {

  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    cb(new Error('Only image files are allowed!'));
  }
  cb(null, true);
};

let storage = multer.diskStorage({
  destination: (req,file, cb) => {
    cb(null, path.join(`${__dirname}/../public/images`));
  },
  filename: (req, file, cb) => {
    const id = req.user.id;
    cb(null, `${id}.${file.originalname}`);
  },
});

let uploadFile = multer({
  storage: storage,
  fileFilter: imageFilter
});
module.exports = {
  uploadFile
};