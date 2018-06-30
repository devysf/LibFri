var express = require("express");
var router = express.Router({mergeParams : true});
var Book = require("../models/book");
var Comment = require("../models/comment");


// COMMENTS ROUTES

// we add isLoggedIn middleware function because of preventing new comments from user who is not logged in
router.get("/new",isLoggedIn ,function(req,res){
  //find book by id . Dont foreget every book object has comment models

  Book.findById(req.params.id, function(err,book){
    if(err){
      console.log(err);
    }
    else{
      res.render("comments/new", {book : book});
    }
  });
});

// we add isLoggedIn middleware function because of preventing new comments from user who is not logged in
router.post("/",isLoggedIn, function(req,res){
  //find books with id
  Book.findById(req.params.id,function(err,book){
    if(err){
      console.log(err);
    }
    else{
      // create comment with given request
      Comment.create(req.body.comment,function(err,comment){
        if(err){
          console.log(err);
        }
        //add username and id to comment collections
        comment.cAuthor.id = req.user._id;
        comment.cAuthor.username = req.user.username;

        comment.save();

        //add comment to book model
        book.comments.push(comment);
        book.save();

        res.redirect("/books/" + book._id);
      });
    }
  });
});

//comment edit route
router.get("/:comment_id/edit",function(req,res){
  Comment.findById(req.params.comment_id,function(err,foundComment){
    if(err){
      console.log(err + "comment edit route");
      res.redirect("back");
    }else{
      res.render("comments/edit",{book_id : req.params.id, comment:foundComment});
    }
  });
});

//comment update route
router.put("/:comment_id",function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
    if(err){
      console.log(err+ "comment update route");
      res.redirect("back");
    }
    else {
      res.redirect("/books/" + req.params.id);
    }
  });
});

//comment destroy route
router.delete("/:comment_id",function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id,function(err){
    if(err){
      console.log(err+ "comment destroy route");
      res.redirect("back");
    }else{
      res.redirect("/books/" + req.params.id);
    }
  })
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated() ){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
