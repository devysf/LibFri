var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
  name : String,
  bImage : String,
  bAuthor : String,
  bCost : Number,
  description : String,
  createdAt : { type : Date, default : Date.now },
  author : {
            id:{
              type: mongoose.Schema.Types.ObjectId,
              ref: "User"
            },
            username : String
  },

  comments : [
      {
        type : mongoose.Schema.Types.ObjectId,
        ref  : "Comment"
      }
  ]
});

module.exports = mongoose.model("Book",bookSchema);
