const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const shortId = require('shortid');
const _ = require('lodash');

const User = require('../models/User');
const { registerEmailParams, forgotPasswordEmailParams } = require('../config/email');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });


const register = (req, res) => {
  const { name, email, password, categories } = req.body;

  User.findOne({ email: email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: 'Email is already taken!'
      });
    }

    const token = jwt.sign({ name, email, password, categories }, process.env.JWT_ACCOUNT_ACTIVATION, {
      expiresIn: '30m'
    });

    const params = registerEmailParams(email, token);
  
    const sendEmailOnRegister = ses.sendEmail(params).promise();
  
    sendEmailOnRegister
      .then(data => {
        console.log('email submitted to SES', data);
        res.json({
          message: `Email has been sent to ${email}. Follow the instructins to complete your registration.`
        })
      })
      .catch(err => {
        console.log('Ses on register email error', err);
        res.json({
          message: 'We could not verify your email. Please try again.'
        })
      });
  });
};

const activateRegistration = (req, res) => {
  const { token } = req.body;

  jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
    if (err) {
      return res.status(401).json({
        error: 'Expired link.  Try again.'
      });
    }

    const { name, email, password, categories } = jwt.decode(token);
    const username = shortId.generate();

    User.findOne({ email: email }).exec((err, user) => {
      if (user) {
        return res.status(401).json({
          error: 'Email is taken.'
        });
      }

      const newUser = new User({ username, name, email, password, categories });
      newUser.save((err, result) => {
        if (err) {
          return res.status(401).json({
            error: 'Error saving user in database.  Try again later.'
          })
        }
        return res.json({
          message: 'Registration complete.  Please log in.'
        })
      })
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist.  Please register or try again.'
      })
    }

    //authenticate using method we created in model
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'Email and password do not match.'
      })
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d'});
    const { _id, name, email, role } = user;

    return res.json({
      token,
      user: {
        _id,
        name,
        email,
        role
      }
    });
  });
};

const forgotPassword = (req, res) => {
  const { email } = req.body;
  User.findOne({ email: email }).exec((err, user) => {
    if (err || !user) {
      return res.json({
        error: 'User with that email does not exist.'
      });
    }

    const token = jwt.sign({ name: user.name }, process.env.JWT_RESET_PASSWORD, { expiresIn: '15m'});

    const params = forgotPasswordEmailParams(email, token);

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.json({
          error: 'Password reset failed.  Please try again.'
        });
      }

      const sendEmail = ses.sendEmail(params).promise();
      sendEmail
        .then(data => {
          console.log('ses reset password success', data);
          return res.json({
            message: `Email has been sent to ${email}.  Click on the link to reset your password.`
          });
        })
        .catch(error => {
          console.log('ses reset password failed', data);
          return res.json({
            message: `We could not verify your email.  Please try again.`
          });
        })
    });
  })
};

const resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  if (resetPasswordLink) {
    jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, (err, sucess) => {
      if (err) {
        return res.status(400).json({
          error: 'Exprired link.  Please try again.'
        });
      }

      User.findOne({ resetPasswordLink: resetPasswordLink }).exec((err, user) => {
        if (err ||!user) {
          return res.status(400).json({
            error: 'Invalid token.  Please try again.'
          });
        }

        const updatedFields = {
          password: newPassword,
          resetPasswordLink: ''
        };

        //merges objects
        user = _.extend(user, updatedFields);

        user.save((err, result) => {
          if (err) {
            return res.status(400).json({
              error: 'Password rest failed.  Please try again.'
            });
          }

          res.json({
            message: 'Password reset!  You are good to go!'
          });
        });
      });
    });
  }
};

exports.register = register;
exports.activateRegistration = activateRegistration;
exports.login = login;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
