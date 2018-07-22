var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Book = require("../models/book");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");


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
  var username  =  req.body.username,
      password  = req.body.password,
      password2 = req.body.password2,
      firstname = req.body.firstname,
      lastname  = req.body.lastname,
      email     = req.body.email,
      avatar    = req.body.avatar;

  // Form Validator
  req.checkBody('username','Username field is required').notEmpty();
  req.checkBody('email','Email field is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('firstname','Firstname field is required').notEmpty();
  req.checkBody('lastname','Lastname field is required').notEmpty();
  req.checkBody('password','Password field is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(req.body.password);

  // Check Errors
  var loginFormErrors = req.validationErrors();

  if(loginFormErrors){
    res.render("register",{ loginFormErrors: loginFormErrors} );
  }
  else{
    var newUser = new User({
      username  : username,
      firstname : firstname,
      lastname  : lastname,
      email     : email,
      avatar    : avatar
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
  }

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


//forgot password
router.get("/forgot",function(req,res){
  res.render("forgot");
});

router.post("/forgot",function(req,res,next){
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },

    function(token,done){
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },

    function(token, user, done){
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'info.libfri@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'info.libfri@gmail.com',
        subject: 'LibFri Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err){
      if(err) return next(err);
      res.redirect("/forgot");
  });
});


//reset password
router.get("/reset/:token",function(req,res){
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err,user){
    if(!user){
      req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
    }

    res.render("reset",{token: req.params.token} );
  });
});

router.post("/reset/:token",function(req,res){
  async.waterfall([

    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        }

        else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },

    function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'info.libfri@gmail.com',
            pass: process.env.GMAILPW
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'info.libfri@mail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.username + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
  }

  ], function(err){
       res.redirect('/books');
  });
});


//USER PROFILE
router.get("/users/:id",function(req,res){
  User.findById(req.params.id, function(err, foundUser){
    if(err){
      req.flash("error","Something went wrong");
      return res.redirect("/");
    }

    Book.find().where("author.id").equals(foundUser._id).exec(function(err,foundBooks){
      if(err){
        req.flash("error","Something went wrong");
        return res.redirect("/");
      }
      res.render("users/show",{user: foundUser, books: foundBooks});
    });
  });
});

module.exports = router;
