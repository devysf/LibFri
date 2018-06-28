var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Book        = require("./models/book"),
    Comment     = require("./models/comment"),
    seedDb      = require("./seeds");

mongoose.connect("mongodb://localhost/lib_fri");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

seedDb();

app.get("/",function(req,res){
  res.render("home");
});

//INDEX - show all books
app.get("/books",function(req,res){
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
app.get("/books/new",function(req,res){
  res.render("books/new");
});

//CREATE - add new book to DB
app.post("/books",function(req,res){
  // get data from form and add to database
  var name = req.body.name;
  var bImage = req.body.bImage;
  var bAuthor = req.body.bAuthor;
  var description = req.body.description;
  var newBook = {name : name , bImage: bImage, bAuthor: bAuthor , description:description};

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
app.get("/books/:id",function(req,res){
  //find the book with provided ID
  // to find comment in book collection , we use populate("comments")
  Book.findById(req.params.id).populate("comments").exec(function(err, foundBook){
    if(err){
      console.log(err);
    }
    else {
      // write
      console.log(foundBook)

      //render show template with that book
      res.render("books/show",{book : foundBook} );
    }
  });
});


// COMMENTS ROUTES

app.get("/books/:id/comments/new",function(req,res){
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

app.post("/books/:id/comments",function(req,res){
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


app.listen(3000,function(){
  console.log("The server has started");
});
