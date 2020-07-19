const AppError = require('../utils/appError');

// Error handlers
const handleCastErrorDB = err => {
  const message = `Não existe um ${err.path} com este valor: ${err.value}`;

  return new AppError(message, 400);
}

const handleDuplicateFieldsErrorDB = err => {
  const message = `Já este um project com este nome: ${err.keyValue.name}. Porfavor utilize um outro nome`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.properties.message);
  const message = `Foi colocado dados invalidos. \n ${errors.join('.')}`;

  return new AppError(message, 400);
};

// Sending Erros
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    name: err.name,
    code: err.code,
    message: err.message,
    error: err,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Errors that trust
  if (err.isOperational) { 
    return res.status(err.statusCode).json({
      status: err.status, 
      message: err.message, 
    });
  } 

  // Programming error, unknown error
  res.status(500).json({
    status: 'error',
    message: 'Algum occoreu muito mal'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error = { ...err };   

    // Handling mongoose errors
    if (err.name === 'CastError') err = handleCastErrorDB(err)
    if (err.code === 11000) err = handleDuplicateFieldsErrorDB(err)
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err)

    sendErrorProd(err, res);
  }
};

// Errors coming from mongoose wont be marked as operational erros
// So we need to come them has operational erros manully
// Erros like: invalid IDs, duplicated key, required field, validation error
// Errors like: not include in enum