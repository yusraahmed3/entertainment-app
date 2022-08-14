import { MongoClient, ObjectId } from "mongodb";
import mongoose from "mongoose";
import dbConnect from "../../../utils/dbConnection";
import User from "../../../models/User";

export default async function handler(req, res) {
  const { id } = req.query;
  const item = req.body;
  const objectId = ObjectId(id);
  await dbConnect();
  if (req.method === "POST") {
    try {
      const result = await User.findOne({ _id: objectId });
      if (!result) {
        return res
          .status(404)
          .json({ message: "No user found. Create an account!", error: true });
      }
      const favorites = await User.updateOne(
        { _id: ObjectId(id) },
        { $push: { favorites: item } }
      );
      res
        .status(201)
        .json({ favorites, error: false, message: "Added to favorites" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: true });
    }
  } else {
    try {
      const result = await User.findOne({ _id: objectId });
      if (!result) {
        console.log("No users found");
        return res
          .status(404)
          .json({ message: "No user found. Create an account!", error: true });
      }
      const favorites = await User.findOne({ _id: objectId }).select({
        favorites: 1,
        _id: 0,
      });
      res.status(200).json(favorites);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}
