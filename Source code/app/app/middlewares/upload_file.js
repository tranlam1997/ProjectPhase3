const multer = require('multer');
const path = require('path');

const imageFilter = (req, file, cb) => {

  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    cb(new Error('Only image files are allowed!'));
  }
  cb(null, true);
};

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(`${__dirname}/../public/images`));
  },
  filename: (req, file, cb) => {
    const id = req.params.id;
    if (!id) return res.status(400).send( { message : 'You must provide an id' });
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