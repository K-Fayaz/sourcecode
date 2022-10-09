  const mongoose = require('mongoose');
  let db_url = process.env.DB_URL || 'mongodb://localhost:27017/sourceCode';
  // mongodb://localhost:27017/sourceCode
  // process.env.DB_URL ||

  mongoose.connect(db_url)
    .then((data)=>{
      console.log(`Connected to Database ${db_url}`);
      // console.log(data);
    })
    .catch((error)=>{
      console.log(error);
    })


  mongoose.Promise = Promise;
  exports.Blog = require("./blog");
  exports.Reply = require("./replyModel");
  exports.Comment = require('./commentModel');
  exports.Subscriber = require('./subscriberModel');
