const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


let emailLengthChecker = (email) => {
  if (!email) {
    return false;
  } else {
    if (email.length < 5 || email.length > 35) {
      return false;
    } else {
      return true;
    }
  }
};

let validEmailChecker = (email) => {
  // Check if e-mail exists
  if (!email) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid e-mail
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email); // Return regular expression test results (true or false)
  }
};

const emailValidators = [{
    validator: emailLengthChecker,
    message: 'Email must be at least 5 characters but no more 35'
  },
  {
    validator: validEmailChecker,
    message: 'Must be a valid email'
  }
];

let validUsername = (username) => {
  // Check if username exists
  if (!username) {
    return false; // Return error
  } else {
    // Regular expression to test if username format is valid
    const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
    return regExp.test(username); // Return regular expression test result (true or false)
  }
};

const usernameValidators = [{
  validator: validUsername,
  message: 'Username must not have any special characters'
}];
// Validate Function to check if valid password format
let validPassword = (password) => {
  // Check if password exists
  if (!password) {
    return false; // Return error
  } else {
    // Regular Expression to test if password is valid format
    const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
    return regExp.test(password); // Return regular expression test result (true or false)
  }
};

// Array of Password validators
const passwordValidators = [{
  validator: validPassword,
  message: 'Must have at least one uppercase, lowercase, special character, and number'
}];

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: emailValidators
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30,
    validate: usernameValidators
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 35,
    validate: passwordValidators
  }
});


userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  bcrypt.hash(this.password, null, null, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
