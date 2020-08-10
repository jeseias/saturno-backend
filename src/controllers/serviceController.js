const sharp = require('sharp');
const Service = require('../models/serviceModel');
const Factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const upload = require('../utils/upload');
const AppError = require('../utils/appError');

exports.uploadServicePhoto = upload.single('photo');

exports.resizeServicePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  if (!req.file.mimetype.startsWith('image'))
    return next(
      new AppError('So podes fazer upload de uma imagen', 400)
    );

  req.file.filename = `${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/allservices/${req.file.filename}`);

  req.body.photo = req.file.filename;

  next();
});

exports.createService = Factory.createOne(Service);
exports.getOne = Factory.getOne(Service);
exports.getAll = Factory.getAll(Service);
exports.updateOne = Factory.updateOne(Service);
exports.deleteOne = Factory.deleteOne(Service);