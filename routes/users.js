const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/users");

const userSchema = mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  password: String,
  email: String,
  isLogin: Boolean,
});

module.exports = mongoose.model("users", userSchema);