  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;

  const userSchema = new Schema({
    userName:{
      type:String,
      required: true
    },
    email:{
      type:String,
      required: true
    },
    googleId:{
      type:String,
      required: true
    },
    profilepic:{
      type:String,
      required: true
    },
    comments:{
      type: [ mongoose.Schema.Types.ObjectId ],
      ref:'Comment'
    }
  });


  const User = mongoose.model('User',userSchema);
  module.exports = User;
