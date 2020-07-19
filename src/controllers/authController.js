const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

// Generates a new token
const signToken = id => 
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {  
  const token = signToken(user._id);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: false,
    httpOnly: true
  }

  if (process.env.NODE_ENV === 'production') cookieOption.secure = true;
  res.cookie('jwt', token, cookieOption); 

  // Remove the password
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  // const url = `${req.protocol}://${req.get('host')}/me`;
  // await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Por providencia o seu email e senha!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !await user.correctPassword(password, user.password)) {
    return next(new AppError('Senha ou email deve estar errado', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  const { authorization, cookies } = req.headers;
  let token;
  
  // Getting token and check if it's there
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  } else if (cookies.jwt) {
    token = cookies.jwt;
  }
  
  if (!token) {
    return next(
      new AppError('Porfavor faça primeiro o login, para teres acceso')
    );
  }
  
  // Verfication os token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
  // Check if user still exist
  const currentUser = await User.findById(decoded.id);
  
  if (!currentUser) {
    return next(
      new AppError('Este usuario já não existe')
    );
  }
    
  // Check if user recently changed 
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('Usuário recentemente mudou a senha! Porfavor faça o loin novamente')
    );
  }
  
  req.user = currentUser;
  
  // Vai para proxima rota
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Não tens permisão para fazer está ação')
      );
    }

    return next();
  }
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email)
    return next(
      new AppError('Porfavor providencia o seu email')
    );

  // get user base on POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(
      new AppError('Não existe usuário com este email')
    );
  
  const resetToken = user.createResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetUrl).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token enviado para o seu email'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('Houve um erro ao  enviar o email. Tente novamente')
    );
  }

});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on the token
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) 
    return next(
      new AppError('o token so é valido por 10 minutos! Por favor tente novamente.', 404)
    );
  
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // update the password changed propety
  // Already done int pre save middleware

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, password, passwordConfirm } = req.body;
  // 1) Get the user from collection
  const user = await User.findById(req.user._id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('A sua senha atual esta errada', 401));
  }

  // Check if password & passwordConfirm a present
  if (!password || !passwordConfirm) {
    return next(new AppError('Por favor coloque a sua nova senha e confirma-a', 401));
  }

  // 3) If so, update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate() Will NOT WORK

  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});