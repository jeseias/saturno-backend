const router = require('express').Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// Authentication 
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Clientes
router.use(authController.protect);
router.patch('/updateMyPassword', (req, res, next) => {console.log(req.user.id);  next()}, authController.updatePassword);
router.patch(
  '/updateMe', 
  userController.uploadUserPhoto, 
  userController.resizeUserPhoto, 
  userController.updateMe
);
router.get('/me', userController.getMe, userController.getUser);
router.get('/dashboard', userController.getMe, userController.dashboard);

router.delete('/deleteMe', userController.deleteMe);

// Admin managin users
router.use(authController.restrictTo('admin'));
router  
  .route('/')
  .get(userController.getAllUsers)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;