const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

//serialize and deserialize
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passport-local config
passport.use(new LocalStrategy(User.authenticate()));
