import mongoose from 'mongoose';

const connectDB = async (mongo_url) => {
  try {
    await mongoose.connect(mongo_url);
    return console.log("MongoDB connected");
  } catch (err) {
    return console.error(`MongoDB connection error: ${err.message}`);
  }
};



export default connectDB;
