const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync'); 
const AppError = require('../utils/appError'); 
const Factory = require('./handlerFactory');

exports.setDate = (req, res, next) => {
  const months = [
    'Jan',
    'Fev',
    'Mar',
    'Apr',
    'Jun',
    'Jul',
    'Aug',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ]; 
  const date = new Date();
  req.body.date = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  next();
}

exports.checkIfUserAlreadyHasReviews = catchAsync(async (req, res, next) => {
  const thisUserReviews = await Review.find({ user: req.user._id }); 

  if (thisUserReviews[0]) {
    return next(new AppError('So és permitido adicionar um testemunho.'))
  }

  next();
});

exports.adminAll = Factory.getAll(Review);
exports.adminUpdate = Factory.updateOne(Review);

exports.createOne = Factory.createOne(Review);
exports.getAll = Factory.getAll(Review, {visible: { $ne: false }});
exports.getOne = Factory.getOne(Review);
exports.updateOne = Factory.updateOne(Review);
exports.deleteOne = Factory.deleteOne(Review);
 