import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";

export const connectionDB = async (req, res) => {
  try {

    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connection established..!");

  } catch (error) {

    console.log("Error while connecting to the Mongodb", error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error while connecting to the MongoDb" });
  }
  
};
