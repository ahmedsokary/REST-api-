const express=require("express");
const bodyParser=require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/wikiDb', {useNewUrlParser: true,useUnifiedTopology: true});


const app=express();
app.set('view engine', 'ejs'); //ejs set at view
app.use(express.static("public"));//for css
app.use(bodyParser.urlencoded({ extended: true }))

const wikiSchema= new mongoose.Schema({
  title:String,
  content:String
})

const Article=mongoose.model("Article",wikiSchema);


//note: to use the postman we must run our code on hyper

//////////////////////request targeting the entire article////////////////
app.route('/articles')//this app.route is to dec redundency by given the path /articles to all an then adding each of their function
//step 1 in bulding api
.get(function(req,res){
  Article.find(function(err,result){//the data inside the atrticle collection i desfined the db in robomon
    if(err)
    {
    res.send(err);
    }
    else{
      res.send(result);

    }
  })
//step 2 in bulding api
}).post(function(req,res){
  //geting the data from postman app
    const newArticle= new Article({
      //this will add our new article to the collection in robomongo
      title:req.body.title,
      content:req.body.content
    })
    newArticle.save(function(err){//the send will be sent to postman app as it will be waiting for a responce after sending the data
      if(err)//this callback function for postman
      res.send(err);
      else
      res.send("succesfully added a nwe article");
    });
})
//step 3 in bulding api
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(err)
    res.send(err);
    else
    res.send("the articles deleted succesfully");
  })
});

////////////////////////////target a specfic article////////////////
app.route('/articles/:articleTitle')
.get(function(req,res){
//to search by the title using the extention of the url localhost:3000/articles/ahmed
//if your title contain space the code for space in url %20 u can google it
Article.findOne({title:req.params.articleTitle},function(err,foundTitle){
  if(err)
  res.send(err);
  else{
if(foundTitle)
res.send(foundTitle);
else
res.send("no match found");

  }
})

})
//using postman the  article u want to update in url of the postman and in body the  new item and content u want to be updated with
//note: if u left any field empty (title or content) in the body it will be removed by data base (robomongo)
//step 4 in bulding api
.put(function(req,res){
//put is to replace the entir article
Article.update(
  {title:req.params.articleTitle},//find the article u want to update from url specefied
  {title:req.body.title,content:req.body.content},//replace what u specified by the new item enterd in the body of postman
  {overwrite:true},//to enable the overwrite of the entire articles\
  function(err)
  {
    if(err)
    res.send(err)
    else
    res.send("succesfully updated")
  }

)
})

//step 5 in bulding api
.patch(function(req,res){
//patch is to replace the a part of article
Article.update(
  {title:req.params.articleTitle},
  {$set:req.body},//it will get the body and set what is specefied in theere to the url given
  function(err)
  {
    if(err)
    res.send(err)
    else
    res.send("succesfully updated")
  }

)
})
//delete a specefic article by the url name
.delete(function(req,res){
Article.deleteOne({title:req.params.articleTitle},function(err){
  if(err)
  res.send(err)
  else
  res.send("the article is deleted succesfully");
})

});



app.listen(3000,function(){
  console.log("connection set at 3000");
})
