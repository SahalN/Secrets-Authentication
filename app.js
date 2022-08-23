//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

const app =express();

console.log(process.env.API_KEY);


// Untuk Akses folder html
app.use(express.static("public"));
// ejs
app.set('view engine', 'ejs');
// body parser
app.use(bodyParser.urlencoded({extended: true}));

// Connect Database mongoose
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

// Buat Schema

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// Pastikan ketikkan kode sebelum model
// Ini akan merahasiakan password saja. jika ingin menambahkan field lain maka tambahkan saja setelah password di dalam array
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"]});


const User = mongoose.model("User", userSchema);

// Root Home
app.get("/", function(req, res){
  res.render("home");
});

// Root route login
app.get("/login", function(req, res){
  res.render("login");
});


// Root route register
app.get("/register", function(req, res){
  res.render("register");
});



// User Register
app.post("/register", function(req, res){
  const newUser = new User ({
    // memakai nama yang ada di register page
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    } else {
      res.render("secrets")
    }
  });
});


// User login
app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email: username}, function(err, foundUser){
    if (err){
      console.log(err);
    } else {
      if (foundUser){
        if(foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});




// listen to port 3000
app.listen(3000, function(){
  console.log("This Server Started On Port 3000.");
})
