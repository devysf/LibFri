var Book = require("../models/book");
var Comment = require("../models/comment");


var midObj = {};

 midObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated() ){
    return next();
  }
  res.redirect("/login");
}

midObj.checkBookOwnership = function(req,res,next){
  //check user is authenticate
  if(req.isAuthenticated() ){
    Book.findById(req.params.id, function(err, foundBook){
      if(err){
        console.log(err);
        res.redirect("back");
      }
      else{
        //we know , user is authenticated but we want to know user was shared this book post
        if(foundBook.author.id.equals(req.user._id) ){
          next();
        }
        // if this user dont has this book post, dont allow this process
        else{
          res.redirect("back");
        }
      }
    });
  }

  // if user is not logged in , dont allow this process
  else{
    res.redirect("back");
  }
}

midObj.checkCommentOwnership = function(req,res,next){
  //check user is authenticate
  if(req.isAuthenticated() ){
    Comment.findById(req.params.comment_id,function(err,foundComment){
      if(err){
        console.log(err);
        res.redirect("back");
      }else{
        //we know , user is authenticated but we want to know user was shared this comment post
        if(foundComment.cAuthor.id.equals(req.user._id) ){
          next();
        }
        // if this user dont has this book post, dont allow this process
        else{
          res.redirect("back");
        }
      }
    });
  }

  // if user is not logged in , dont allow this process
  else{
    res.redirect("back");
  }
}

module.exports = midObj;
