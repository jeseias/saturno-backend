const router = require('express').Router();
const bookingController = require('../controllers/bookingController');
const handlerController = require('../controllers/handlerController');
const notificationController = require('../controllers/notificationController');
const authController = require('../controllers/authController');

router.use(authController.protect);

router
  .route('/')
  .post(
    authController.restrictTo('client'),
    notificationController.sendNotification,
    handlerController.addUserToBody,
    bookingController.newBooking
  )
  .get(
    authController.restrictTo('admin'),
    bookingController.getAllBookings
  );

router.use(authController.restrictTo('admin'));

router  
  .route('/:id')
  .get(bookingController.getBooking)
  .get(bookingController.deleteBooking);

module.exports = router;