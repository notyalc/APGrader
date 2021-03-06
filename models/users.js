var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId,
  Mixed = Schema.Types.Mixed;

//Define User Schema and model
var userSchema = new Schema({
  username: String,
  password: String,
  first: String,
  last: String,
  dirname: String,
  grade: Number,
  class: String,
  period: Number,
  teacher: String,
  admin: Boolean,
  submissions: Mixed
});
var users = mongoose.model('users', userSchema);

module.exports = users;