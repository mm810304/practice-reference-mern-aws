const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('DB Connected')
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;