import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    mongoose.set("strictQuery", false);

    const connect = await mongoose.connect(
      process.env.MONGODB_URI as string,
      {}
    );
    console.log(
      `\n✅Connected to MongoDB in ${process.env["NODE_ENV"]} environment on ${connect.connection.host}\n`
    );
  } catch (error: any) {
    console.log(
      `\n❌Connection to database in ${process.env["NODE_ENV"]} environment did not succeed 😔\n`
    );
    return error.message;
  }
};

export default connectMongoDB;
