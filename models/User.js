const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  image: { type: String, default: "uploads/1660316612100--avatar.png" },
  favorites: Array,
  watchlist: Array,
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
