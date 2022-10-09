  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;

  const blogSchema = new Schema({
    title:{
      type:String,
      required: true
    },
    image:{
      type:String,
      required: false
    },
    description:{
      type:String,
      required: true
    },
    date:{
      type:Date,
      default:Date.now()
    },
    edited:{
      type:Boolean,
      default:false
    },
    body:{
      type:String,
      required: true
    },
    category:{
      type:String,
      required: true
    },
    likes:{
      type:Number,
      default:0,
      required: false,
    },
    comments:{
      type:[ mongoose.Schema.Types.ObjectId ],
      ref:'Comment'
    }
  })


  const Blog = mongoose.model('blog',blogSchema);
  module.exports = Blog;
