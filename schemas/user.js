const mongoose = require('mongoose');
const { Schema } = mongoose;


const userSchema = new Schema({
  firstName: String,
  lastName: String,
  username:  {type: String, required: true, unique: true},
  email:  {type: String, required: true, unique: true},
  password: {type: String, required: true},
  timestamp: { type: Date, default: Date.now}
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

module.exports = User