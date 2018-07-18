var express = require("express");
var router = express.Router();
var Book = require("../models/book");
var midObj = require("../middleware");

//settings for cloudinary to upload file
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'dmuf8wudc',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


//INDEX - show all books
router.get("/",function(req,res){
  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search),'gi');
    // Get all books from DB
    Book.find({name: regex},function(err,allBooks){
      if(err){
        console.log(err);
      }
      else{

        if(allBooks.length<1){
          res.render("books/index",{books : allBooks, page: 'books',error: "No books match that query, please try again."} );
        }
        else {
          res.render("books/index",{books : allBooks, page: 'books',success: "All books match that your query."} );
        }

      }
    });

  }
  else {
    // Get all books from DB
    Book.find({},function(err,allBooks){
      if(err){
        console.log(err);
      }
      else{
        res.render("books/index",{books : allBooks, page: 'books' } );
      }
    });
  }
});

function escapeRegex(text){
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

//NEW - show form to create new book
router.get("/new",midObj.isLoggedIn,function(req,res){
  res.render("books/new");
});

//CREATE - add new book to DB
router.post("/",midObj.isLoggedIn, upload.single('image'), function(req,res){

  cloudinary.uploader.upload(req.file.path, function(result) {

    // add cloudinary url for the image to the book object under image property
    req.body.book.bImage = result.secure_url;
    // add author to campground
    req.body.book.author = {
      id: req.user._id,
      username: req.user.username
    }

    // Create a new book and save to database
    Book.create(req.body.book, function(err, book) {
      if (err) {
        req.flash('error', err.message);
        return res.redirect('back');
      }
      req.flash("success", "Successfully added books");
      res.redirect('/books/' + book.id);
    });
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
router.get("/:id/edit",midObj.checkBookOwnership,function(req,res){
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
router.put("/:id",midObj.checkBookOwnership,function(req,res){
  Book.findByIdAndUpdate(req.params.id,req.body.book,function(err,updatedBook){
    if(err){
      console.log(err);
    }
    else{
      req.flash("success", "Successfully updated books");
      res.redirect("/books/" + req.params.id);
    }
  });
});

//destroy book route
router.delete("/:id",midObj.checkBookOwnership,function(req,res){
  Book.findByIdAndRemove(req.params.id,function(err){
    if(err){
      console.log(err + "deleted books");
      res.redirect("/books");
    }else{
      req.flash("success", "Successfully deleted books");
      res.redirect("/books");
    }
  });
});



module.exports = router;
