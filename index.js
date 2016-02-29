"use strict";
let express = require('express');
var app = express();
app.use(express.static('static'));
let http = require('http');
var srv = http.Server(app);
let sio = require('socket.io');
var io = sio(srv);
let Twitter = require('twitter');
var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

//client.stream('user', {}, (stream) => { //this uses your timeline instead but needs consumer_key and other stuff up above
client.stream('statuses/filter', {track: '#gamedev'}, (stream) => {
  stream.on('data', (tweet) => {
    console.log(tweet);
    io.emit('tweet', tweet);
  });
  stream.on('error', (error) => {
    throw error;
  });
});
srv.listen(4000);
