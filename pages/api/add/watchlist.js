import { ObjectId } from "mongodb";
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
      const watchlist = await User.updateOne(
        { _id: ObjectId(id) },
        { $addToSet: { watchlist: item } }
      );
      res
        .status(201)
        .json({ watchlist, error: false, message: "Added to watchlist!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error", error: true });
    }
  } else if (req.method === "GET") {
    try {
      const result = await User.findOne({ _id: objectId });
      if (!result) {
        return res
          .status(404)
          .json({ message: "No user found. Create an account!", error: true });
      }
      const watchlist = await User.findOne({ _id: objectId }).select({
        watchlist: 1,
        _id: 0,
      });
      res.status(200).json(watchlist);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: error.message });
    }
  } else {
    try {
      const result = await User.findOne({ _id: item.userId });
      if (!result) {
        return res
          .status(404)
          .json({ message: "No user found. Create an account!", error: true });
      }

      await User.updateOne(
        { _id: item.userId },
        { $pull: { watchlist: { id: item.itemId } } },
        { safe: true, multi: true }
      )
        .then(() =>
          res
            .status(200)
            .json({ error: false, message: "Removed from watchlist!" })
        )
        .catch(() =>
          res
            .status(401)
            .json({ error: true, message: "Something went wrong!" })
        );
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: true, message: error.message });
    }
  }
}
