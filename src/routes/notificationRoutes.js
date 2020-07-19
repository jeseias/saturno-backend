const router = require('express').Router();
const notificationController = require('../controllers/notificationController');
const authController = require('../controllers/authController');

router.unsubscribe(
  authController.protect,
  authController.restrictTo('admin'),
);

router.get('/', notificationController.getNotifications);

router
  .route('/:id')
  .get(notificationController.getNotification)
  .patch(notificationController.updateNotification)
  .delete(notificationController.deleteNotification)

module.exports = router;