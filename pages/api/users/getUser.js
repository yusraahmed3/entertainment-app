import { ObjectId } from "mongodb";
import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnection";

export default async function handler(req, res) {
  const { id } = req.query;
  const objectId = ObjectId(id);
  await dbConnect();
  try {
    const user = await User.findById(objectId).select({
      watchlist: 0,
      favorites: 0,
      password: 0,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found", error: true });
    } else {
      return res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
}
