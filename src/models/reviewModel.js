const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  project: {
    type: mongoose.Types.ObjectId,
    ref: 'Project'
  },
  saying: {
    type: String,
    required: [true, 'Um testemunho deve ter um dizer!'],
    maxlength: [300, 'O seu testemunho é muito longo'],
    minlength: [90, 'O seu testemunho é muito curto'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Um testemunho deve ter um rating'],
    default: '4.3'
  },
  visible: {
    type: Boolean,
    default: false
  },
  date: {
    type: String,
  },
  top: {
    type: Boolean,
    default: false
  }
});

// Pre findAll query to populate user
ReviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: '-__v -passwordChangedAt -role -email -phone '
  }); 

  next();
});

// Only show visible review
// ReviewSchema.pre('find', function(next) {
//   this.find({ visible: { $ne: false } }); 
//   next();
// });

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;