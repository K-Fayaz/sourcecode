const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const replySchema = new Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
  },
  reply:{
    type:String,
    required: true
  },
  date:{
    type:Date,
    default: Date.now()
  }
});



const Reply = mongoose.model('Reply',replySchema);
module.exports = Reply;
