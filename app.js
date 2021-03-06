var express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  flash = require("connect-flash"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  expressSession = require("express-session"),
  expressValidator = require("express-validator"),
  Book = require("./models/book"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDb = require("./seeds");
require("dotenv").config();

// importing ROUTES
var commentRoutes = require("./routes/comments"),
  bookRoutes = require("./routes/books"),
  indexRoutes = require("./routes/index");

const mongoDB = require("./config/mongodbKeys").mongoURI;
mongoose
  .connect(mongoDB)
  .then(() => console.log("Mongodb connected"))
  .catch(err => console.log(err));

//mongoose.connect("mongodb://localhost/lib_fri");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));

app.use(flash());
//seedDb();

//PASSPORT.JS Congiguration

app.use(
  expressSession({
    secret: "This is a keyword to help hashing your password.",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//we pass this variable template pages to use this variable in that file. then we can easily control which user is logged in
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  res.locals.loginFormErrors = req.flash("loginFormError");
  next();
});

//Now moment is available for use in all of your view files
//via the variable named moment
app.locals.moment = require("moment");

// Validator settings
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

app.use("/", indexRoutes);
app.use("/books", bookRoutes);
app.use("/books/:id/comments", commentRoutes);

const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("The server has started");
});
