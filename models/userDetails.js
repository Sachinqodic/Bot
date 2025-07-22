import mongoose from "mongoose";

const UserDetails = new mongoose.Schema({

  _id: { type: String, required: true },
  name: { type: String, required: true },

  score: { type: Number },
  rank: { type: Number },
});

const Users = mongoose.model("Users", UserDetails, "users");

export default Users;
