// var express = require('express');
const router = require('../index');
const movieModel = require('./movies-model');
router.get('/movies', async function(req , res, err) {
  if(err){
    res.sendStatus(500).json({messge: "Api Failed"});
  }
  const movies = await movieModel.find();
  res.send(movies);

})