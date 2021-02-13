const slugify = require('slugify');
const formidable = require('formidable');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const Category = require('../models/Category');
const Link = require('../models/Link');


const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});


const createCategory = (req, res) => {
  const { name, image, content } = req.body;

  const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const imageType = image.split(';')[0].split('/')[1];

  const slug = slugify(name);

  let category = new Category({ name, content, slug });

  const params = {
    Bucket: 'mern-practice-node-aws',
    Key: `category/${uuidv4()}.${imageType}`,
    Body: base64Data,
    ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: `image/jpeg`
  };

  s3.upload(params, (err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Upload to s3 failed'
      });
    }

    category.image.url = data.Location;
    category.image.key = data.Key;

    category.postedBy = req.user._id;

    //save to db
    category.save((err, success) => {
      if (err) res.status(400).json({ error: 'Error saving category to db.'});
      return res.json(success);
    });
  });
};

const getAllCategories = (req, res) => {
  Category.find({}).exec((err, data) => {
    if (err) return res.status(400).json({ error: 'Could not load all categories' });
    res.json(data);
  });
};

const getSingleCategory = (req, res) => {
  const { slug, limit, skip } = req.params;
  let limitNum = limit ? parseInt(limit) : 15;
  let skipNum = skip ? parseInt(skip) : 0


  Category.findOne({ slug: slug })
    .populate('postedBy', '_id name username')
    .exec((err, category) => {
    if (err) res.status(400).json({ error: 'Could not load category.'});
    
    Link.find({ categories: category })
      .populate('postedBy', '_id name username')
      .populate('categories', 'name')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skipNum)   
      .exec((err, links) => {
        if (err) res.status(400).json({ error: 'Could not load links for that category.'});
        res.json({
          category,
          links
        })
      }) 
  });
};

const updateCategory = (req, res) => {
  const { slug } = req.params;
  const { name, image, content } = req.body;

  const base64Data = new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
  const imageType = image.split(';')[0].split('/')[1];

  Category.findOneAndUpdate({ slug }, { name, content }, { new: true }).exec((err, updated) => {
    if (err) res.status(400).json({ error: 'Could not update category - update category controller'});

    if (image) {
      const deleteParams = {
        Bucket: 'mern-practice-node-aws',
        Key: `${updated.image.key}`,
      };

      s3.deleteObject(deleteParams, function(err, data) {
        if (err) {
          console.log('S3 Image delete error during update')
        } else {
          console.log('S3 deleted during update', data);
        }
      });

      const params = {
        Bucket: 'mern-practice-node-aws',
        Key: `category/${uuidv4()}.${imageType}`,
        Body: base64Data,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: `image/jpeg`
      };

      s3.upload(params, (err, data) => {
        if (err) {
          return res.status(400).json({
            error: 'Upload to s3 failed'
          });
        }
    
        updated.image.url = data.Location;
        updated.image.key = data.Key;
       
        //save to db
        updated.save((err, success) => {
          if (err) res.status(400).json({ error: 'Error saving category to db.'});
          res.json(success);
        });
      });
    } else {
      res.json(updated)
    }
  });
};


const removeCategory = (req, res) => {
  const { slug } = req.params;
  Category.findOneAndRemove({ slug }).exec((err, data) => {
    if (err) res.status(400).json({ error: 'Could not delete category - remove cat controller'});

    const deleteParams = {
      Bucket: 'mern-practice-node-aws',
      Key: `${data.image.key}`,
    };

    s3.deleteObject(deleteParams, function(err, data) {
      if (err) {
        console.log('S3 Image delete error during delete')
      } else {
        console.log('S3 deleted during delete', data);
      }
    });

    res.json({ message: 'Category deleted successfully.'});

  })
};

exports.createCategory = createCategory;
exports.getAllCategories = getAllCategories;
exports.getSingleCategory = getSingleCategory;
exports.updateCategory = updateCategory;
exports.removeCategory = removeCategory;