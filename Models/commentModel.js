const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Reply = require('./replyModel');


const commentSchema = new Schema({
  owner:{
    type: mongoose.Schema.Types.ObjectId ,
    ref:'User',
    required: true
  },
  comment:{
    type:String,
    required: true
  },
  reply:{
    type: [ Schema.Types.ObjectId ],
    ref:'Reply'
  },
  date:{
    type:Date,
    default: Date.now()
  }
});

const Comment = mongoose.model('Comment',commentSchema);

module.exports = Comment;
