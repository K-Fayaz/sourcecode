  require('dotenv').config();
  const express = require('express');
  const app = express();
  const ejsMate = require('ejs-mate');
  const path = require('path');
  const methodOverride = require("method-override");
  const session = require('express-session');
  const passport = require('passport');
  const User = require('./Models/userModel');
  const cors = require("cors");
  const PORT = process.env.PORT || 3000 ;
  require("./Models/index");

  // Express routes
  const blogRoutes = require('./Routes/blogRoutes');
  const userRoutes = require('./Routes/userRoutes');
  const subscriberRoutes = require('./Routes/subscribeRoute');


  app.use(cors({
    'Access-Control-Allow-Origin':'*'
  }))

  app.engine('ejs',ejsMate);
  app.set('view engine','ejs');
  app.use(express.static(path.join(__dirname,'public')));

  app.set('views',path.join(__dirname,'views'));

  app.use(express.urlencoded({
    extended:true,
    parameterLimit:10000000,
    limit:'500mb' // to remove the Payload too latge error (which you might get)
  }));


  app.use(methodOverride('_method'));

  // define session details
  const sessionConfig = {
    secret: 'This is a secret',
    saveUninitialized:false,
    resave:false
  }

  app.use(session(sessionConfig));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user,done)=>{
    done(null,user.id)
  });


  passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=> done(err,user))
  })


  app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    next();
  })


  app.use('/',blogRoutes);
  app.use('/',userRoutes);
  app.use('/',subscriberRoutes);

  app.get("/error",(req,res)=>{
    res.render("notFound");
  })

  // if none of the routes match than render the 404 not found page

  app.get('*',(req,res)=>{
    res.render("notFound");
  })

  const port = process.env.PORT ||  3000;

  app.listen(port,()=>{
    console.log(`Listening to the Port : ${port}`)
  });
