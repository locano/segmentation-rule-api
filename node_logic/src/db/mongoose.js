const mongoose = require("mongoose");

const connectDB = async () => {
  let isConnected = false;
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
  } catch (err) {
    console.error(err);
    process.exit(1);
    isConnected = false;
  }

  return isConnected
};

module.exports = connectDB;
