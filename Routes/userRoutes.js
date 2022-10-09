  const express = require('express');
  const router = express.Router();
  const session = require('express-session');
  const passport = require('passport');
  const  GoogleStrategy = require('passport-google-oauth20').Strategy;
  const User = require('../Models/userModel');


  passport.use(new GoogleStrategy({
          clientID: '683636288796-ik267lpl3t07duhq7qs89eic22t8n8ia.apps.googleusercontent.com',
          clientSecret:'rMrklCnVBrjLq7tr0i1EqsWH',
          callbackURL:'https://sourcecode7.herokuapp.com/google/callback'
      },
      async function (accessToken , refreshToken , profile , done)
      {
        let newUser = {
          userName: profile.displayName,
          email: profile.emails[0].value,
          profilepic:profile.photos[0].value,
          googleId:profile.id
        }

        try{
          let user = await User.findOne({ googleId :profile.id });

          if(user){
            // dont create a new user and redirect to callback url
            done(null,user);
          }
          else{
            // create a new user , store it in db and redirect to callback URL
            user = await User.create(newUser);
            await user.save();
            done(null , user);
          }

        }
        catch(err){
          console.log(err);
        }
      }
  ))

  function pleaseLogMeIn(req,res,next){
    let { page , id }  = req.query;

    if(page == 'home'){
      req.session.redirectUrl = '/';
      console.log(req.session.redirectUrl);
      next();
    }
    else if(page == 'allBlogs'){
      req.session.redirectUrl = '/all-blog-post/';
      console.log(req.session.redirectUrl);
      next();
    }
    else if(id){
      req.session.redirectUrl = `/read/blog/${id}/`;
      console.log(req.session.redirectUrl);
      next();
    }else{
      next();
    }
  }

  // login page router
  router.get('/login/',(req,res)=>{
    res.render('login');
  })


  router.get('/auth/google/login/',pleaseLogMeIn,passport.authenticate('google',{ scope:[ 'profile' , 'email' ] }))

  router.get('/google/callback',
    passport.authenticate('google',{ failureRedirect:'/error' }),(req,res)=>{
      try{
        let path = req.session.redirectUrl || '/';
        console.log(path);
        res.redirect(path)
      }
      catch(err){
        // if an error occurs reditect it to 404 page

        res.render("notFound");

      }
    })

  router.get('/user/logout',pleaseLogMeIn,async (req,res)=>{
    try{
      req.logout();
      // let path = req.session.redirectUrl
      res.redirect('/');
    }
    catch(err){
      res.render("notFound");
    }
  })


  module.exports = router;
