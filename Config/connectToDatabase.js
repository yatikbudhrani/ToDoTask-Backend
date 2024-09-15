import { set, connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DB_STRING;

/**
 * Connects to the MongoDB database using the provided connection string.
 * Sets the "strictQuery" option to false and attempts to establish a connection.
 * Logs a success message if the connection is successful, otherwise logs an error message and exits the process.
 * @returns None
 */
const connectDB = async () => {
  set("strictQuery", false);
  try {
    await mongoose.connect(connectionString, {
      autoIndex: true,
    });
    console.log("Connected to Mongodb Atlas");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
