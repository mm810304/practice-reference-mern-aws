const mongoose = require('mongoose');
const crypto = require('crypto');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    max: 20,
    unique: true,
    index: true,
    lowercase: true
  },
  name: {
    type: String,
    trim: true,
    required: true,
    max: 50
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: String,
  role: {
    type: String,
    default: 'subscriber'
  },
  resetPasswordLink: {
    data: String,
    default: ''
  },
  categories: [
    {
      type: ObjectId,
      ref: 'Category',
      required: true
    }
  ]
}, { timestamps: true });

//virtual field
userSchema.virtual('password').set(function(password) {
  this._password = password;

  this.salt = this.makeSalt();

  this.hashedPassword = this.encryptPassword(password);
}).get(function() {
  return this._password;
})

//methods --> auth, encryption, make salt
userSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },

  encryptPassword: function(password) {
    if (!password) return;

    try {
      return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    } catch (err) {
      return;
    }
  },

  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random());
  } 
}

const User = mongoose.model('User', userSchema);

module.exports = User;



