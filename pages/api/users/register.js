import User from "../../../models/User";
import { hash } from "bcryptjs";
import dbConnect from "../../../utils/dbConnection";

export default async function handler(req, res) {
  const { email, password, confirmPassword } = req.body;
  await dbConnect();

  try {
    if (!email || !email.includes("@") || !password || !confirmPassword) {
      return res.status(422).json({ message: "Invalid data", error: true });
    }

    const result = await User.findOne({ email });
    if (result) {
      return res.status(409).json({
        message: "Email is already registered. Try logging in instead",
        error: true,
      });
    }

    if (password !== confirmPassword) {
      return res
        .status(401)
        .json({ error: true, message: "Passwords do not match" });
    }

    const registered = await User.create({
      email,
      password: await hash(password, 12),
    });
    console.log(registered);
    res.status(201).json({
      registered,
      error: false,
      message: "Registered successfully. Please log in to continue.",
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: true, message: "Error signing up" });
  }
}
