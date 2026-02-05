import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://piyush:piyush@cluster0.igtbx2d.mongodb.net/?appName=Cluster0"

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI);
};
