import User from "../../../models/User";
import dbConnect from "../../../utils/dbConnection";
import nextConnect from "next-connect";
import multer from "multer";
import { ObjectId } from "mongodb";

export const config = {
  api: {
    bodyParser: false,
  },
};

let storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/uploads");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

const uploadFile = upload.single("file");

const handler = nextConnect({
  onError(err, req, res, next) {
    res
      .status(500)
      .json({ message: `Something went wrong! ${err}`, error: true });
  },
  onNoMatch(req, res) {
    res.status(404).end("Page not found");
  },
});

handler.use(uploadFile);

handler.post(async (req, res) => {
  const id = req.query;
  const objectId = ObjectId(id);
  try {
    const filePath = req.file.path.replace("public", "");
    const user = await User.findById(objectId);
    if (!user) {
      return res.status(400).json({ message: "User not found", error: true });
    } else {
      user.image = filePath || user.image;
    }

    const updatedImage = await user.save();
    console.log(updatedImage);
    res.status(200).json({
      message: "Image Uploaded",
      image: updatedImage.image,
      error: false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
});

export default handler;
