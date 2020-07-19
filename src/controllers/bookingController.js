const Booking = require('../models/bookingModel');
const Factory = require('./handlerFactory');

exports.newBooking = Factory.createOne(Booking);
exports.getAllBookings = Factory.getAll(Booking, {  });
exports.getBooking = Factory.getOne(Booking);
exports.deleteBooking = Factory.deleteOne(Booking);
