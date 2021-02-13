const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    max: 50
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    index: true
  },
  image: {
    url: String,
    key: String
  },
  content: {
    type: {},
    min: 20,
    max: 2000000
  },
  postedBy: {
    type: ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;