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

router.use(
  authController.protect, 
  authController.restrictTo('admin'),
)

router
  .route('/:id')
  .patch( 
    projectController.uploadProjectMedia,
    projectController.projectUpload,
    projectController.projectTechs,
    projectController.updateProject
  )
  .delete(  
    projectController.deleteProject
  );

router.patch('/content/:id',  
  projectController.projectTechs,
  projectController.updateProject
)

module.exports = router;