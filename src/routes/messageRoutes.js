const router = require('express').Router();
const messageController = require('../controllers/messageController');
const authController = require('../controllers/authController');
const notificationController = require('../controllers/notificationController');

router
  .route('/')
  .post(
    notificationController.sendNotification,
    messageController.sendMessage
  )
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    messageController.seeAllMessages
  );

router.use(
  authController.protect,
  authController.restrictTo('admin')
);

router  
  .route('/:id')
  .get(messageController.seeMessage)
  .delete(messageController.deleteMessage)

module.exports = router;
