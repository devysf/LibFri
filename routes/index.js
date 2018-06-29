var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//home page route
router.get("/",function(req,res){
  res.render("home");
});


// AUTH routes

//show register form
router.get("/register",function(req,res){
  res.render("register");
});

//sign up logic
router.post("/register",function(req,res){
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
router.get("/login",function(req,res){
  res.render("login");
});

//login logic
router.post("/login",passport.authenticate("local",
  {
    successRedirect : "/books",
    failureRedirect : "/login"
  }), function(req,res){

});


//logout routes
router.get("/logout",function(req,res){
  req.logout();
  res.redirect("/books");
});

module.exports = router;