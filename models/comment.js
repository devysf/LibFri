var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
  cText : String,
  cAuthor: {
            id : {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User"
            },
            username : String
  }
});

module.exports = mongoose.model("Comment", commentSchema);
