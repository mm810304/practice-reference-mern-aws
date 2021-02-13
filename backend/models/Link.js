const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const linkSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    max: 256
  },
  url: {
    type: String,
    trim: true,
    required: true,
  },
  //Do not need slug right now - but could add functionality later with it
  slug: {
    type: String,
    lowercase: true,
    required: true,
  },
  postedBy: {
    type: ObjectId,
    ref: 'User'
  },
  categories: [
    {
      type: ObjectId,
      ref: 'Category',
      required: true
    }
  ],
  type: {
    type: String,
    default: 'Free'
  },
  medium: {
    type: String,
    default: 'Video'
  },
  clicks: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Link = mongoose.model('Link', linkSchema);

module.exports = Link;