const mongoose = require('mongoose');
const validator = require('validator');

const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Para enviar mensagen deves escrever o seu nome'],
    minlength: 3
  },
  email: {
    type: String,
    required: [true, 'Porfavor preencha o seu email'],
    validate: [validator.isEmail, 'Coloque o email valido']
  },
  phone: {
    type: String,
    required: [true, 'Coloque o seu numero de telefone'],
    minlength: 5
  },
  message: {
    type: String,
    required: [true, 'Para entrares em contacto deves escrever uma mensagen'],
    minlength: [3, 'A sua mensagen é muito curta'],
    maxlength: [300, 'A sua mensagen é muito longa']
  },
  typeOfNotification: {
    type: String,
    enum: ['message', 'work', 'client-message'],
    default: 'message'
  }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
