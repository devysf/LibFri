var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var books =[
        { name:"The Da Vinci Code" , bAuthor:"Dan Brown" , bImage:"http://www.altinkitaplar.com.tr/static/img/2012/10/da-vinci-sifresi-m.jpg"},
        { name:"The Da Vinci Code" , bAuthor:"Dan Brown" , bImage:"http://www.altinkitaplar.com.tr/static/img/2012/10/da-vinci-sifresi-m.jpg"},
        { name:"The Da Vinci Code" , bAuthor:"Dan Brown" , bImage:"http://www.altinkitaplar.com.tr/static/img/2012/10/da-vinci-sifresi-m.jpg"},
        { name:"The Da Vinci Code" , bAuthor:"Dan Brown" , bImage:"http://www.altinkitaplar.com.tr/static/img/2012/10/da-vinci-sifresi-m.jpg"}
      ];

//Basic roote settings
app.get("/",function(req,res){
  res.render("home");
});

app.get("/books",function(req,res){
  res.render("books",{books : books});
});

app.get("/books/new",function(req,res){
  res.render("new");
});

app.post("/books",function(req,res){
  //to parse req.body , we import body-parser at the top
  var name = req.body.name;
  var bImage = req.body.bImage;
  var bAuthor = req.body.bAuthor;
  var newBook = {name : name , bImage: bImage, bAuthor: bAuthor};

  books.push(newBook);

  res.redirect("/books");

});


app.listen(3000,function(){
  console.log("The server has started");
});
