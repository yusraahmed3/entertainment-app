import { ObjectId } from "mongodb";
import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnection";
import { compare, hash } from "bcryptjs";

export default async function handler(req, res) {
  const id = req.query;
  const objectId = ObjectId(id);
  const { oldPassword, newPassword, confirmNewPass } = req.body;
  try {
    await dbConnect();

    const user = await User.findOne({ _id: objectId });

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const checkPasswords = await compare(oldPassword, user.password);
    if (!checkPasswords) {
      return res
        .status(401)
        .json({ error: true, message: "Incorrect password" });
    }

    if (newPassword !== confirmNewPass) {
      return res
        .status(401)
        .json({ error: true, message: "Passwords do not match" });
    }

    user.password = (await hash(newPassword, 12)) || user.password;

    await user.save();

    res
      .status(200)
      .json({ error: false, message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: error.message });
  }
}
