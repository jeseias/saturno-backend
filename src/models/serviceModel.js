const mongoose = require('mongoose');

const ServiceSchema =  new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Servico deve ter uma nome'],
    unique: true
  },
  photo: {
    type: String,
    required: [true, 'Servico deve ter uma imagen']
  },
  summary: {
    type: String,
    required: [true, 'Servico deve ter um summario']
  }
}, { 
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

// Vitual properties
ServiceSchema.virtual('img__url').get(function() {
  const dev = false 
    ? `${process.env.LOCATION}:${process.env.PORT}/api/v1/files/img/allservices/${this.photo}`
    : `${process.env.LOCATION}/api/v1/files/img/allservices/${this.photo}`
    
  return dev;
});

const Service = mongoose.model('Service', ServiceSchema);

module.exports  = Service;