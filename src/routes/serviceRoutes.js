const router = require('express').Router();
const serviceController = require('../controllers/serviceController');
const authController = require('../controllers/authController');

router.get('/', serviceController.getAll);

router.use(
  authController.protect,
  authController.restrictTo('admin'),
);

router.post('/', 
  serviceController.uploadServicePhoto,
  serviceController.resizeServicePhoto,
  serviceController.createService,
);

router.route('/:id') 
  .get(serviceController.getOne)
  .patch(serviceController.updateOne)
  .delete(serviceController.deleteOne);
  
module.exports = router;