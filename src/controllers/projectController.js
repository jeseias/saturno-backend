const sharp = require('sharp');
const Project = require('../models/projectModel');
const Factory = require('./handlerFactory');
const upload = require('../utils/upload');
const catchAsync = require('../utils/catchAsync');


exports.uploadProjectMedia = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 6 },
  { name: 'video', maxCount: 1 }
]);

exports.projectUpload = catchAsync(async (req, res, next) => { 
  // Cover photo
  req.body.imageCover = `projec-${req.body.name}-cover-${Date.now()}.jpg`;
  await sharp(req.files.imageCover[0].buffer)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/projects/${req.body.imageCover}`);

  // All projects images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `project-${req.body.name}-${Date.now()}-${i+1}.jpg`;
      await sharp(file.buffer)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/projects/${filename}`);

      req.body.images.push(filename);
    })
  );  
  next();
});

exports.projectTechs = catchAsync(async (req, res, next) => {
  const { techs } = req.body;
  req.body.techs = techs.split(', ');

  next();
});

exports.createProject = Factory.createOne(Project);
exports.getProject = Factory.getOne(Project);
exports.getAllProjects = Factory.getAll(Project, {  });
exports.deleteProject = Factory.deleteOne(Project);
exports.updateProject = Factory.updateOne(Project);