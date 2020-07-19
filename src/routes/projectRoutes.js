const router = require('express').Router();
const authController = require('../controllers/authController');
const projectController = require('../controllers/projectController');

router  
  .route('/')
  .get(projectController.getAllProjects)
  .post( 
    authController.protect, 
    authController.restrictTo('admin'), 
    projectController.uploadProjectMedia,
    projectController.projectUpload,
    projectController.projectTechs,
    projectController.createProject
  );

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(
    authController.protect, 
    authController.restrictTo('admin'), 
    projectController.updateProject
  )
  .delete(
    authController.protect, 
    authController.restrictTo('admin'), 
    projectController.deleteProject
  );

module.exports = router;