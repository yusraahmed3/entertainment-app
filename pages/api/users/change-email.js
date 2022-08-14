import { ObjectId } from "mongodb";
import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnection";
import { compare } from "bcryptjs";

export default async function handler(req, res) {
  const id = req.query;
  const objectId = ObjectId(id);
  const { password, oldEmail, newEmail } = req.body;
  try {
    await dbConnect();

    const user = await User.findOne({ _id: objectId });

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const checkPasswords = await compare(password, user.password);
    if (!checkPasswords) {
      return res
        .status(401)
        .json({ error: true, message: "Incorrect password" });
    }

    if (oldEmail !== user.email) {
      return res.status(401).json({ error: true, message: "Incorrect email" });
    }

    user.email = newEmail || user.email;

    await user.save();

    res
      .status(200)
      .json({ error: false, message: "Email changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
}
