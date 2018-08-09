var express = require("express");
var path=require('path');
var passport = require("passport");
var LinkedInStrategy = require("passport-linkedin");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//var session = require("express-session");
var User = require("./user");
var k,j;
var profilename;
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/linkedin_data", function(err , db)
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
       db.collection('users').count().then(function(result){
       console.log(result)
       k = result;
        j=k+1;
         }, function(err){
           return console.log(err);
             });
      console.log("database has been connected!");
    }
  });

app.use(bodyParser.urlencoded({extended : true}));
app.use('', express.static(path.join(__dirname + '')));
app.set('views', path.join(__dirname, 'views'));

app.use(passport.initialize());

app.use(require("express-session")({
    secret: "books page",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


LINKEDIN_API_KEY = "817x9mwaj2f7fc";
LINKEDIN_SECRET_KEY = "DxczzjGX0OiFZRQl";


passport.use(new LinkedInStrategy({
    consumerKey: LINKEDIN_API_KEY,
    consumerSecret: LINKEDIN_SECRET_KEY,
    callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback",
    profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline']
  },
  function(token, tokenSecret, profile, profileFields ,done) {
    console.log("==========================");
    console.log(profileFields);
    console.log("============================");
    //console.log(profile);
    profilename = profileFields.displayName;
    linkedinId = profileFields.id;
    profile.token = token;
    profile.tokenSecret = tokenSecret;
    console.log(linkedinId);
    console.log(profile.token);
    var data = {linkedinId : linkedinId , name : profileFields.displayName, headline : profileFields._json.headline, email : profileFields._json.emailAddress ,  token : profile.token};
         User.create( data, function(err,user){
           if(err)
           {
            console.log(err);
           }else{
            console.log("data is inserted");
            console.log(user);
            return done(err, user);
            console.log(user);
           }
         });
      } 
));

app.get('/auth/linkedin',
  passport.authenticate('linkedin', { scope: ['r_basicprofile', 'r_emailaddress'] }));

app.get('/auth/linkedin/callback', 
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home

   User.find({name:profilename} , function(err , data){
     if(err)
     {
      console.log(err)
     }else{
     console.log("*********************************************");
     console.log(k);
     console.log(profilename);
      console.log("**********************************************");
      console.log(data);

      res.render("home.ejs" , {data : data});
     }
   });
  });

app.get("/login" , function(req,res){
 res.send("galat h bete");
});

app.get("/" , function(req,res){
  res.render("login.ejs");
});

app.listen("3000" , function(req , res){
  console.log("server is started");
});
