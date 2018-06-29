var mongoose = require("mongoose");
var Book = require("./models/book");
var Comment = require("./models/comment");


var data = [
  {
    name : "Kayıp Sembol",
    bImage:"http://www.altinkitaplar.com.tr/static/img/2013/04/kayip-sembol-tum-listelerde-1-numara-m.jpg",
    bAuthor : "Dan Brown",
    description : "Wonderfulll"
  },
  {
    name : "Kayıp Sembol",
    bImage:"http://www.altinkitaplar.com.tr/static/img/2013/04/kayip-sembol-tum-listelerde-1-numara-m.jpg",
    bAuthor : "Dan Brown",
    description : "Wonderfulll"
  },
  {
    name : "Kayıp Sembol",
    bImage:"http://www.altinkitaplar.com.tr/static/img/2013/04/kayip-sembol-tum-listelerde-1-numara-m.jpg",
    bAuthor : "Dan Brown",
    description : "Wonderfulll"
  }
]

// to test our program , we seed database some entry
function seedDb(){
  Book.remove({},function(err){
    if(err){
      console.log(err);
    }
    console.log("removed books");
    /*
    data.forEach(function(seed){
      Book.create(seed,function(err,book){
        if(err){
          console.log(err);
        }
        else {

            console.log("added a book");

            Comment.create(
              {
                cText:"I want to buy it. How can i get this book to yyou?",
                cAuthor:"Yusuf"
              },function(err,comment){
                if(err){
                  console.log(err);
                }
                  else {
                    book.comments.push(comment);
                    book.save();
                    console.log("Created new comment");
                  }

              }
            )
          }
      });
    });
    */
  });
}

module.exports = seedDb;
