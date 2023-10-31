const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/users");

const userSchema = mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String,
  password: String,
  email: String,
  isLogin: Boolean,
  tickets: { type: Array, default: [] }
});

module.exports = mongoose.model("users", userSchema);