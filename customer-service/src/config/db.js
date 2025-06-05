import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_CUSTOMER_SERVICES_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error DB connection: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;