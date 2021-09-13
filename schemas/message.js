const mongoose = require('mongoose');
const { Schema } = mongoose;


const messageSchema = new Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  text:  {type: String, required: true},
  timestamp: { type: Date, default: Date.now}
}, { collection: 'messages' });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message