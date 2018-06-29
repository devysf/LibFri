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


// importing ROUTES
var commentRoutes = require("./routes/comments"),
    bookRoutes    = require("./routes/books"),
    indexRoutes   = require("./routes/index");

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


//we pass this variable template pages to use this variable in that file. then we can easily control which user is logged in
app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  next();
});

app.use("/",indexRoutes);
app.use("/books",bookRoutes);
app.use("/books/:id/comments",commentRoutes);


app.listen(3000,function(){
  console.log("The server has started");
});
