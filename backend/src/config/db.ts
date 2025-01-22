import mongoose from "mongoose";
import { config } from "../constants/env";

export const connectToDb = async () => {
  try {
      const connect = await mongoose.connect(config.env.DATABASE_URL);
      console.log(`Mongodb connect to host ${connect.connection.host}`)
  } catch (error) {
      console.log("Error trying to connect to database")
      process.exit(1)
  }
};
