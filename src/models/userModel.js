const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Deves providenciar o seu nome completo para criar uma conta!'],
  },
  email: {
    type: String,
    required: [true, 'O seu email é neccesário!'],
    unique: true,
    validate: [validator.isEmail, 'Este email não é valido!']
  },
  phone: {
    type: String,
    defualt: '--- --- ---'
  },
  password: {
    type: String,
    required: [true, 'Deves colocar uma senha!'],
    minlength: 8,
    select: false // So that on queires the password should not be returned
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Deves confirmar a sua senha!'],
    validate: {
      validator: function(el) { // el = passwordConfirm
        return el === this.password; // this curren document
      }
    }
  },
  role: {
    type: String,
    required: [true, ''],
    enum: ['client', 'admin'],
    default: 'client'
  },
  photo: {
    type: String,
    default: 'default.jpg'
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: String
}, { 
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
});

// Vitual properties
UserSchema.virtual('img__url').get(function() { 
  return process.env.LOCATION !== 'http://127.0.0.1:' 
          ? `${process.env.LOCATION}/api/v1/files/img/users/${this.photo}`
          : `${process.env.LOCATION}${process.env.PORT}/api/v1/files/img/users/${this.photo}`;
});

// Encrypt my password
UserSchema.pre('save', async function(next) {
  // I only want to run this function if password field was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with code of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // We dont need this field anymore. So it wont be persisted to the database

  next();
});

// Check if password was modified
UserSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  // We substract 1s to ensure that the token is always created after the password has been changed
  this.passwordChangedAt = Date.now() - 1000;
  
  next();
});

// Check if password is correct before login
UserSchema.methods.correctPassword = async function(
  candidatePassword, userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Checks if password was changes after token has been created
// So the user needs to login again, because password was changes
UserSchema.methods.changedPasswordAfter = function(JWTTimeStamp) {
  // Check if passwordChanged fields really has a value
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimeStamp < changedTimeStamp; // 100 < 200
  }

  // If passwordChanged Field is empty return false
  // because it was not changed
  return false;
}

UserSchema.methods.createResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 100 // 10min in ms

  return resetToken;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;
