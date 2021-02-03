// Check the file sended.
module.exports.filterMulter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const extention = file.mimetype.split('/')[1];

  const extName = fileTypes.test(extention.toLowerCase());

  if (extName && file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Only jpeg, jpg, and png formats are allowed.', 400), false);
  }
};

// Rename picture.
module.exports.filenameMulter = (req, file, cb) => {
  const ext = file.mimetype.split('/')[1];
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  cb(null, `${file.originalname}-${uniqueSuffix}.${ext}`);
};
