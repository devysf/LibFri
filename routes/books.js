var express = require("express");
var router = express.Router();
var Book = require("../models/book");


//INDEX - show all books
router.get("/",function(req,res){
  // Get all books from DB
  Book.find({},function(err,allBooks){
    if(err){
      console.log(err);
    }
    else{
      res.render("books/index",{books : allBooks} );
    }
  });
});


//NEW - show form to create new book
router.get("/new",isLoggedIn,function(req,res){
  res.render("books/new");
});

//CREATE - add new book to DB
router.post("/",isLoggedIn,function(req,res){
  // get data from form and add to database
  var name = req.body.name;
  var bImage = req.body.bImage;
  var bAuthor = req.body.bAuthor;
  var description = req.body.description;
  //create author variable. This variable is saved database to specify user who was added book
  var author = {
    id : req.user._id,
    username : req.user.username
  }
  var newBook = {name : name , bImage: bImage, bAuthor: bAuthor , description:description,
                  author : author};

  // Create a new book and save to database
  Book.create(newBook,function(err,newlyBook){
    if(err){
      console.log(err);
    }
    else{
        res.redirect("/books");
    }
  });
});


// SHOW - shows more info about one book
router.get("/:id",function(req,res){
  //find the book with provided ID
  // to find comment in book collection , we use populate("comments")
  Book.findById(req.params.id).populate("comments").exec(function(err, foundBook){
    if(err){
      console.log(err);
    }
    else {
      
      //render show template with that book
      res.render("books/show",{book : foundBook} );
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
