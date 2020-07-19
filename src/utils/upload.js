const multer = require('multer');
const AppError = require('./appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video')) {
    cb(null, true);
  } else {
    cb(
      new AppError('Só é posivel fazer upload de videos e imagen!', 400), 
      file
    );
  }
}; 

module.exports = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});