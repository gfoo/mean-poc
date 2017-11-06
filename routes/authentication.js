const User = require('../models/user');
const jwt = require('jsonwebtoken'); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require('../config/database'); // Import database configuration

module.exports = (router) => {

  router.post('/register', (req, res) => {
    // req.body.email
    // req.body.username
    // reqs.body.password
    if (!req.body.email) {
      res.json({
        success: false,
        message: 'You  must provide an email'
      });
    } else {
      if (!req.body.username) {
        res.json({
          success: false,
          message: 'You  must provide a username'
        });
      } else {
        if (!req.body.password) {
          res.json({
            success: false,
            message: 'You  must provide a password'
          });
        } else {
          let user = new User({
            email: req.body.email.toLowerCase(),
            username: req.body.username.toLowerCase(),
            password: req.body.password
          });
          user.save((err) => {
            if (err) {
              if (err.code === 11000) {
                res.json({
                  success: false,
                  message: 'Username or email already exist'
                });
              } else {
                if (err.errors) {
                  if (err.errors.email) {
                    res.json({
                      success: false,
                      message: err.errors.email.message
                    });
                  } else if (err.errors.username) {
                    res.json({
                      success: false,
                      message: err.errors.username.message
                    });
                  } else if (err.errors.password) {
                    res.json({
                      success: false,
                      message: err.errors.password.message
                    });
                  } else {
                    res.json({
                      success: false,
                      message: err
                    });
                  }
                } else {
                  res.json({
                    success: false,
                    message: 'Could not save user. Error: ',
                    err
                  });
                }
              }
            } else {
              res.json({
                success: true,
                message: 'Account registered'
              });
            }
          });
        }
      }
    }
  });


  router.get('/checkEmail/:email', (req, res) => {
    if (!req.params.email) {
      res.json({
        success: false,
        message: "email was not provided"
      });
    } else {
      User.findOne({
        email: req.params.email
      }, (err, user) => {
        if (err) {
          res.json({
            success: false,
            message: err
          });
        } else {
          if (user) {
            res.json({
              success: false,
              message: "Email is not available"
            });
          } else {
            res.json({
              success: true,
              message: "Email is available"
            });
          }
        }
      });
    }
  });

  router.get('/checkUsername/:username', (req, res) => {
    if (!req.params.username) {
      res.json({
        success: false,
        message: "Username was not provided"
      });
    } else {
      User.findOne({
        username: req.params.username
      }, (err, user) => {
        if (err) {
          res.json({
            success: false,
            message: err
          });
        } else {
          if (user) {
            res.json({
              success: false,
              message: "Username is not available"
            });
          } else {
            res.json({
              success: true,
              message: "Username is available"
            });
          }
        }
      });
    }
  });

  router.post('/login', (req, res) => {
    // Check if username was provided
    if (!req.body.username) {
      res.json({
        success: false,
        message: 'No username was provided'
      }); // Return error
    } else {
      // Check if password was provided
      if (!req.body.password) {
        res.json({
          success: false,
          message: 'No password was provided.'
        }); // Return error
      } else {
        // Check if username exists in database
        User.findOne({
          username: req.body.username.toLowerCase()
        }, (err, user) => {
          // Check if error was found
          if (err) {
            res.json({
              success: false,
              message: err
            }); // Return error
          } else {
            // Check if username was found
            if (!user) {
              res.json({
                success: false,
                message: 'Username not found.'
              }); // Return error
            } else {
              const validPassword = user.comparePassword(req.body.password); // Compare password provided to password in database
              // Check if password is a match
              if (!validPassword) {
                res.json({
                  success: false,
                  message: 'Password invalid'
                }); // Return error
              } else {
                const token = jwt.sign({
                  userId: user._id
                }, config.secret, {
                  expiresIn: '24h'
                }); // Create a token for client
                res.json({
                  success: true,
                  message: 'Success!',
                  token: token,
                  user: {
                    username: user.username
                  }
                }); // Return success and token to frontend
              }
            }
          }
        });
      }
    }
  });

  router.use(function(req, res, next) {
    const token = req.get('Authorization');
    if (!token) {
      res.json({
        success: false,
        message: "Token not provided"
      });
    } else {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          res.json({
            success: false,
            message: "Token is invalid: " + err
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    }
  });

  router.get('/profile', (req, res) => {
    // Search for user in database
    User.findOne({
      _id: req.decoded.userId
    }).select('username email').exec((err, user) => {
      // Check if error connecting
      if (err) {
        res.json({
          success: false,
          message: err
        }); // Return error
      } else {
        // Check if user was found in database
        if (!user) {
          res.json({
            success: false,
            message: 'User not found'
          }); // Return error, user was not found in db
        } else {
          res.json({
            success: true,
            user: user
          }); // Return success, send user object to frontend for profile
        }
      }
    });
  });

  router.get('/publicProfile/:username', (req, res) => {
    // Check if username was passed in the parameters
    if (!req.params.username) {
      res.json({
        success: false,
        message: 'No username was provided'
      }); // Return error message
    } else {
      // Check the database for username
      User.findOne({
        username: req.params.username
      }).select('username email').exec((err, user) => {
        // Check if error was found
        if (err) {
          res.json({
            success: false,
            message: 'Something went wrong.'
          }); // Return error message
        } else {
          // Check if user was found in the database
          if (!user) {
            res.json({
              success: false,
              message: 'Username not found.'
            }); // Return error message
          } else {
            res.json({
              success: true,
              user: user
            }); // Return the public user's profile data
          }
        }
      });
    }
  });
  return router;
}
