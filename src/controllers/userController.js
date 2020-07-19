const sharp = require('sharp');
const User = require('../models/userModel');
const Factory = require('./handlerFactory');
const upload = require('../utils/upload');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) 
      newObject[el] = obj[el];
  });

  return newObject;
}

// Uploads
exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(); 

  if (!req.file.mimetype.startsWith('image'))
    return next(
      new AppError('So podes fazer upload de uma imagen', 400)
    );

  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

// Cliente user
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  // Not used to update password
  if (password || passwordConfirm)
    return next(
      new AppError('Esta routa não é utilizada para atualizar senha. Porfavor usa /updateMyPassword', 400)
    );

  const filteredBody = filterObj(req.body, 'name', 'email', 'phone');
  if (req.file) filteredBody.photo = req.file.filename;
  console.log(filteredBody)
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// Only for admins
exports.getUser = Factory.getOne(User);
exports.getAllUsers = Factory.getAll(User, {  });
exports.updateUser = Factory.updateOne(User);
exports.deleteUser = Factory.deleteOne(User);