const Message = require('../models/messageModel');
const Factory = require('./handlerFactory');

exports.sendMessage = Factory.createOne(Message);
exports.seeAllMessages = Factory.getAll(Message, {  });
exports.seeMessage = Factory.getOne(Message);
exports.deleteMessage = Factory.deleteOne(Message);