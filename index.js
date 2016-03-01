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
client.stream('statuses/filter', {track: process.env.VR_TRACK || '#gamedev'}, (stream) => {
  stream.on('data', (tweet) => {
    if (!("user" in tweet || "entities" in tweet)) return;
    console.log(tweet);
    var payload = {};
    payload.source = "twitter";
    payload.main_image = tweet.user.profile_image_url;
    payload.media = [];
    if ("media" in tweet.entities) for (var media of tweet.entities.media) payload.media.push(media.media_url);
    io.emit('tweet', payload);
  });
  stream.on('error', (error) => {
    throw error;
  });
});
srv.listen(4000);
