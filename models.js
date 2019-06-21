const mongoose = require("mongoose");

module.exports.NewsPost = mongoose.model("NewsPost", {
  id: String,
  link: String,
  title: String,
  comments: [
    mongoose.Schema({
      name: String,
      message: String
    })
  ]
});
