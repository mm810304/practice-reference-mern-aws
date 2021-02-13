const expressJwt = require('express-jwt');
const User = require('../models/User');
const Link = require('../models/Link');

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256']
});

exports.userAuth = (req, res, next) => {
  console.log('userAuth function in middleware running');
  console.log(req.user)
  const authUserId = req.user._id;

  User.findOne({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found.'
      });
    }

    req.profile = user;
    next();
  })
};

exports.adminAuth = (req, res, next) => {
  const adminUserId = req.user._id;

  User.findOne({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found.'
      });
    }

    if (user.role !== 'admin') {
      return res.status(400).json({
        error: 'Access Denied.  You do not have admin access.'
      });
    }

    req.profile = user;
    next();
  })
};

exports.canUpdateDeleteLink = (req, res, next) => {
  const { id } = req.params;
  Link.findOne({ _id: id }).exec((err, data) => {
    if (err) res.status(400).json({ error: 'Could not find link.'});

    let authorizedUser = data.postedBy._id.toString() === req.user._id.toString();

    if (!authorizedUser) {
      return res.status(400).json({ error: 'You are not authorized to complete this action.'});
    }

    next();
  });
};