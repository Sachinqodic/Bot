import Users from "../models/userDetails.js";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

export const Userdata = async (req, res) => {
  let { fname } = req.body;

  console.log("This is data from the  body:", req.body);

  try {

    const getId = (prefix) =>
      `${prefix || "id"}_${uuidv4().slice(0, 13).replace("-", "")}`;

    const userIdToBeCreated = getId("usr");

    console.log(uuidv4());

    let user = await Users.create({
      _id: userIdToBeCreated,
      name: fname,
    });

    console.log("New user created here:", user);

    return res
      .status(StatusCodes.OK)
      .json({ message: "User created successfully" });
      
  } catch (error) {
    console.log("Error occurred while creating the new user");
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};
