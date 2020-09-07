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

router.route('/img/:id') 
  .patch( 
    serviceController.deleteImages,
    serviceController.uploadServicePhoto,
    serviceController.resizeServicePhoto,
    serviceController.updateOne
  );

router.route('/:id') 
  .get(serviceController.getOne)
  .patch(serviceController.updateOne)
  .delete(
    serviceController.deleteImages,
    serviceController.deleteOne
  );
  
module.exports = router;