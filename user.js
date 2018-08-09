var mongoose = require("mongoose");
var passport = require("passport");
var LinkedInStrategy = require("passport-linkedin");

UserSchema = new mongoose.Schema({
   linkedinId : String,
   name : String,
   headline : String,
   email : String,
   token : String
});

//UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);