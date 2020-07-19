const router = require('express').Router();
const reviewController = require('../controllers/reviewController');
const handlerController = require('../controllers/handlerController');
const authController = require('../controllers/authController');

router.get('/', reviewController.getAll);
router.get('/:id', reviewController.getOne);

router.use(authController.protect);

router.post('/',
  authController.restrictTo('client'),
  handlerController.addUserToBody,
  reviewController.setDate,
  reviewController.checkIfUserAlreadyHasReviews,
  reviewController.createOne
);

router.use(authController.restrictTo('client'));

router
  .route('/:id')
  .patch(reviewController.updateOne)
  .delete(reviewController.deleteOne);

router.use(authController.restrictTo('admin'));

router.get('/admin/', reviewController.adminAll);
router.patch('/admin/:id', reviewController.adminUpdate);

module.exports = router;