var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
  cText : String,
  cAuthor: String
});

module.exports = mongoose.model("Comment", commentSchema);
