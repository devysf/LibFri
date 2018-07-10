var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Book = require("../models/book");

//home page route
router.get("/",function(req,res){
  res.render("home");
});


// AUTH routes

//show register form
router.get("/register",function(req,res){
  res.render("register",{page: 'register'});
});

//sign up logic
router.post("/register",function(req,res){

  var newUser = new User({
    username : req.body.username,
    firstname: req.body.firstname,
    lastname : req.body.lastname,
    email: req.body.email,
    avatar : req.body.avatar
  });

  User.register(newUser,req.body.password,function(err,user){
    if(err){
      console.log(err);
      return res.render("register", {error: err.message});
    }

    passport.authenticate("local")(req,res,function(){
      req.flash("success", "We are very happy to join our family. Welcome to LibFri " + user.username);
      res.redirect("/books");
    });

  });
});

//show login Form
router.get("/login",function(req,res){
  res.render("login",{page: 'login'});
});

//login logic
router.post("/login",passport.authenticate("local",
  {
    successRedirect : "/books",
    failureRedirect : "/login",
    failureFlash : true,
    successFlash: "Welcome to YelpCamp!"
  }), function(req,res){

});


//logout routes
router.get("/logout",function(req,res){
  req.flash("success", "Logged you out!");
  req.logout();
  res.redirect("/books");
});



//USER PROFILE
router.get("/users/:id",function(req,res){
  User.findById(req.params.id, function(err, foundUser){
    if(err){
      req.flash("error","Something went wrong");
      res.redirect("/");
    }

    Book.find().where("author.id").equals(foundUser._id).exec(function(err,foundBooks){
      if(err){
        req.flash("error","Something went wrong");
        res.redirect("/");
      }
      res.render("users/show",{user: foundUser, books: foundBooks});
    });
  });
});

module.exports = router;
