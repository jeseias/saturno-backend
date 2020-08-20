const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  typeOfWork: {
    type: String,
    required: [true, 'Qual é a natureza do trabalho que ques?']
  },
  summary: {
    type: String,
    required: [true, 'Porfavor dê uma explicação bem clara doque precisas']
  }
});

// Pre find populate all usr
BookingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: '-__v  -passwordChangedAt -role'
  });

  next();
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
