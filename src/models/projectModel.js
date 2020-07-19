const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Projecto deve ter um nome'],
    minlength: 3,
    unique: true
  },
  nature: {
    type: String,
    required: [true, 'Projecto deve ter um tipo'],
    enum: ['Web', 'Mobile', 'Desktop', 'Frontend', 'API']
  },
  imageCover: {
    type: String,
    required: [true, 'Projecto deve ter uma imagen principal']
  },
  summary: {
    type: String,
    required: [true, 'Projecto deve um sumário'],
    maxlength: 70,
    minlength: 10
  },
  description: {
    type: String,
    default: function(el) { 
      if (el === '') return `${this.summary}`; 
    }
  },
  link: String,
  video: String,
  images: [String],
  techs: [String]
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
}); 

ProjectSchema.virtual('project__img').get(function() {
  return `${process.env.LOCATION}${process.env.PORT}/api/v1/files/img/projects/${this.imageCover}`;
});

ProjectSchema.virtual('all__images').get(function() {
  return this.images.map(img => `${process.env.LOCATION}${process.env.PORT}/api/v1/files/img/projects/${img}`);
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
