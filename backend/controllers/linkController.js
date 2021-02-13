const slugify = require('slugify');
const AWS = require('aws-sdk');

const Link = require('../models/Link');
const User = require('../models/User');
const Category = require('../models/Category');
const { linkPublishedParams } = require('../config/email');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });


const createLink = (req, res) => {
  console.log(req.body)
  const { title, url, categories, type, medium } = req.body;
  const slug = url;
  let link = new Link({ title, url, categories, type, medium, slug });
  link.postedBy = req.user._id;

  link.save((err, data) => {
    if (err) {
      console.log(err)
      res.status(400).json({ error: 'Link already exists.'})
    }
    res.json(data);

    //find all users that like that category and send mass email
    User.find({ categories: { $in: categories } }).exec((err, users) => {
      if (err) {
        throw new Error(err);
        console.log('Error finding users to send email on link publish');
      }

      Category.find({ _id: { $in: categories }}).exec((err, result) => {
        data.categories = result;
        
        for (let i = 0; i < users.length; i++) {
          const params = linkPublishedParams(users[i].email, data);
          const sendEmail = ses.sendEmail(params).promise();
          sendEmail
            .then(success => {
              console.log('Email submitted to ses', success);
              return;
            })
            .catch(err => {
              console.log('Email error while submitting to ses', success);
              return;
            });
        }
      });

    });
  });
};

const getAllLinks = (req, res) => {
  const { limit, skip } = req.params;
  let limitNum = limit ? parseInt(limit) : 15;
  let skipNum = skip ? parseInt(skip) : 0

  Link.find({})
    .populate('postedBy', 'name')
    .populate('categories', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skipNum)
    .limit(limitNum)
    .exec((err, data) => {
    if (err) res.status(400).json({ error: 'Could not get links.'})
    res.json(data);
  });
};

const clickCount = (req, res) => {
  const { linkId } = req.body;
  Link.findByIdAndUpdate(linkId, {$inc: { clicks: 1}}, { upsert: true, new: true }).exec((err, result) => {
    if (err) res.status(400).json({ error: 'Could not updated view count.'})
    res.json(result);
  });
};

const getSingleLink = (req, res) => {
  const { id } = req.params;

  Link.findOne({ _id: id }).exec((err, data) => {
    if (err) res.status(400).json({ error: 'Could not find link.'});
    res.json(data);
  });

  
};

const updateLink = (req, res) => {
  const { id } = req.params;
  const { title, url, categories, type, medium } = req.body;

  Link.findOneAndUpdate({ _id: id }, { title, url, categories, type, medium }, { new: true }).exec((err, updated) => {
    if (err) res.status(400).json({ error: 'Could not update link.'});

    res.json(updated);
  });
};

const removeLink = (req, res) => {
  const { id } = req.params;
  Link.findOneAndRemove({ _id: id }).exec((err, data) => {
    if (err) res.status(400).json({ error: 'Could not delete the link'});
    res.json({
      message: 'Link removed successfully'
    })
  });
};

const getMostPopularLinks = (req, res) => {
  Link.find()
    .populate('postedBy', 'name')
    .sort({ clicks: -1 })
    .limit(3)
    .exec((err, links) => {
      if (err) res.status(400).json({ error: 'Links not found.'});
      res.json(links);
    });
};

const getMostPopularInCategory = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug }).exec((err, category) => {
    if (err) res.status(400).json({ error: 'Could not load categories.'});
    Link.find({ categories: category }).sort({ clicks: -1 }).limit(3).exec((err, links) => {
      if (err) res.status(400).json({ error: 'Could not find links for that category'});
      res.json(links);
    });
  })
};

exports.createLink = createLink;
exports.getAllLinks = getAllLinks;
exports.getSingleLink = getSingleLink;
exports.updateLink = updateLink;
exports.removeLink = removeLink;
exports.clickCount = clickCount;
exports.getMostPopularLinks = getMostPopularLinks;
exports.getMostPopularInCategory = getMostPopularInCategory;