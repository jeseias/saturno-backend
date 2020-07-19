const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  typeOfNotication: {
    type: String,
    required: [true, 'Notification must have a nature'],
    default: 'message'
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  username: {
    type: String,
    required: [true, 'Who sent this messsage']
  },
  active: {
    type: Boolean,
    default: true,
  },
  notificationMessage: String
});

// Pre findAll query to populate user
NotificationSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: '-__v -passwordChangedAt -role -email'
  });

  next();
});

// Get one notification
NotificationSchema.pre(/findOne/, function(next) {
  this.populate({
    path: 'user',
    select: '-__v -passwordChangedAt -email'
  });

  next();
});

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
