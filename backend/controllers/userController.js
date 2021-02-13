const User = require('../models/User');
const Link = require('../models/Link');

const getUserInfo = (req, res) => {
  User.findOne({ _id: req.user._id }).exec((err, user) => {
    if (err) res.status(400).json({ error: 'Could not find that user.'});

    Link.find({ postedBy: user })
      .populate('categories', 'name slug')
      .populate('postedBy', 'name')
      .sort({ createdAt: -1})
      .exec((err, links) => {
      if (err) res.status(400).json({ error: 'Could not find links for that user.'});
      
      user.hashedPassword = undefined;
      user.salt = undefined;

      res.json({
        user,
        links
      });
    });
  });
};

const updateUser = (req, res) => {
  const { name, password, categories } = req.body;

  switch(true) {
    case password && password.length < 6:
      return res.status(400).json({ error: 'Password must be at least 6 characters longs.' });
      break;
  }

  User.findOneAndUpdate({ _id: req.user._id }, { name, password, categories }, { new: true }).exec((err, updated) => {
    if (err) res.status(400).json({ error: 'Could not find user to update.'});
    updated.hashedPassword = undefined;
    updated.salt = undefined;
    res.json(updated);
  })


};


exports.getUserInfo = getUserInfo;
exports.updateUser = updateUser;