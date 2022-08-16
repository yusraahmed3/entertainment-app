import dbConnect from "../../../utils/dbConnection";
import User from "../../../models/User";
import jwt from "jsonwebtoken";
import { compare } from "bcryptjs";

export default async function handler(req, res) {
  await dbConnect();
  const { email, password } = req.body;

  try {
    if (!email || !email.includes("@") || !password) {
      return res.status(422).json({ message: "Invalid data", error: true });
    }
    const result = await User.findOne({ email });
    if (!result) {
      return res
        .status(404)
        .json({ message: "No user found. Create an account!", error: true });
    }
    const checkPasswords = await compare(password, result.password);
    if (!checkPasswords) {
      res.status(401).json({ error: true, message: "Invalid credentials" });
    } else {
      const token = jwt.sign({ email, id: result._id }, process.env.SECRET, {
        expiresIn: "1h",
      });
      res.status(200).json({
        email,
        id: result._id.toString(),
        image: result.image,
        token,
        error: false,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: "Error logging in" });
  }
}
