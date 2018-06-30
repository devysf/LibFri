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
      console.log(err + "added book");
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

//edit book route
router.get("/:id/edit",checkBookOwnership,function(req,res){
  Book.findById(req.params.id,function(err, foundBook){
    if(err){
      console.log(err);
    }
    else{
      res.render("books/edit",{ book : foundBook});
    }
  })
});

//update book route
router.put("/:id",checkBookOwnership,function(req,res){
  Book.findByIdAndUpdate(req.params.id,req.body.book,function(err,updatedBook){
    if(err){
      console.log(err);
    }
    else{
      res.redirect("/books/" + req.params.id);
    }
  });
});

//destroy book route
router.delete("/:id",checkBookOwnership,function(req,res){
  Book.findByIdAndRemove(req.params.id,function(err){
    if(err){
      console.log(err + "deleted books");
      res.redirect("/books");
    }else{
      res.redirect("/books");
    }
  });
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated() ){
    return next();
  }
  res.redirect("/login");
}

function checkBookOwnership(req,res,next){
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

module.exports = router;
