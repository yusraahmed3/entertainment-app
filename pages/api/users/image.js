import User from "../../../models/User";
import nextConnect from "next-connect";
import multer from "multer";
import { ObjectId } from "mongodb";
import path from "path";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

export const config = {
  api: {
    bodyParser: false,
  },
};

aws.config.update({
  secretAccessKey: proccess.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: proccess.env.AWS_ACCESS_KEY,
  region: proccess.env.AWS_DEFAULT_REGION,
});

var s3 = new aws.S3({
  /*...*/
});

// let storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, path.join(__dirname, "/tmp"));
//   },
//   filename: (req, file, callback) => {
//     callback(null, Date.now() + "--" + file.originalname);
//   },
// });

let storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET,
  acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata(req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key(req, file, cb) {
    cb(null, Date.now() + "--" + file.originalname);
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
