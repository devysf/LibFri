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
        //add comment to book model
        book.comments.push(comment);
        book.save();
        res.redirect("/books/" + book._id);
      });
    }
  });
});


function isLoggedIn(req, res, next){
  if(req.isAuthenticated() ){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
