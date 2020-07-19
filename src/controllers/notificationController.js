const Notification = require('../models/notificationModel');
const catchAsync = require('../utils/catchAsync');
const Factory = require('./handlerFactory');

exports.sendNotification = catchAsync(async (req, res, next) => { 
  const { user } = req;
  const notiObj = {};

  // IF comes from a logged in user 
  if (user) {
    notiObj.user = user._id;
    notiObj.username = user.name;

    switch (req.body.typeOfNotification) {
      case 'work':
        notiObj.notificationMessage = `O cliente ${user.name.split(' ')[0]} quer tu faças o trabalho para ele`;
        break;
      default:
        notiObj.notificationMessage = `O cliente ${user.name.split(' ')[0]} mandou uma mensagen para voce`;
        break; 
    }

    await Notification.create(notiObj); 

    return next();
  }

  notiObj.username = req.body.name.split(' ')[0];
  notiObj.notificationMessage =  `${notiObj.username} mandou uma mensagen`;
  notiObj.user = undefined;

  await Notification.create(notiObj); 

  next();
});

exports.getNotifications = Factory.getAll(Notification, {  });
exports.getNotification = Factory.getOne(Notification);
exports.updateNotification = Factory.updateOne(Notification);
exports.deleteNotification = Factory.deleteOne(Notification);