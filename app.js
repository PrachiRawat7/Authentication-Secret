require('dotenv').config();
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const saltRound=10;
const app=express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});





const User=new mongoose.model("User",userSchema);




app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){

  bcrypt.hash(req.body.password,saltRound,function(err,hash){
    const newUser=new User({
       email:req.body.username,
      password:hash
    });
    newUser.save(function(err){
      if(err){
        console.log(err);
      }else {
        res.render("secrets");
      }
    });
  });


});


app.post("/login",function(req,res){
  User.findOne({email:req.body.username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        bcrypt.compare(req.body.password,foundUser.password,function(err,result){
          if(result===true){
            res.render("secrets");
          }else{
            console.log("password doesn't match");
          }

        });
      }
      else{
       console.log("Not Found");
     }
  }
  });
});






app.listen(3000,function(req,res){
  console.log("Server running on port 3000");
})
