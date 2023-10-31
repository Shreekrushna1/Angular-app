const mongoose = require('mongoose');
// mongoose.connect("mongodb://localhost:27017/movies");

const movieSchema = mongoose.Schema({
  Title: String,
  Runtime: String,
  Year: String,
  Poster: String,
});

module.exports = mongoose.model("movies", movieSchema);