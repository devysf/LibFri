var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    expressSession = require("express-session"),
    Book        = require("./models/book"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    seedDb      = require("./seeds");

mongoose.connect("mongodb://localhost/lib_fri");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

seedDb();

//PASSPORT.JS Congiguration

app.use(expressSession({
  secret : "This is a keyword to help hashing your password.",
  resave : false,
  saveUninitialized : false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//home page route
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


// AUTH routes

//show register form
app.get("/register",function(req,res){
  res.render("register");
});

//sign up logic
app.post("/register",function(req,res){
  var newUser = new User({username : req.body.username });
  User.register(newUser,req.body.password,function(err,user){
    if(err){
      console.log(err);
      return res.render("register");
    }

    passport.authenticate("local")(req,res,function(){
      res.redirect("/books");
    });

  });
});

//show login Form
app.get("/login",function(req,res){
  res.render("login");
});

//login logic
app.post("/login",passport.authenticate("local",
  {
    successRedirect : "/books",
    failureRedirect : "/login"
  }), function(req,res){

});








app.listen(3000,function(){
  console.log("The server has started");
});
