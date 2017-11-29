'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    feed = require(__base + '/routes/feed-route').feed,
    user = require(__base + '/routes/user-route').user;

app.use(bodyParser.json());


// Url : http://localhost:3000/rest-services/user/get/boulerluc@gmail.com (rest-services/user/get/:Email)
app.post('/rest-services/feed/create/', feed.create);

app.post('/rest-services/user/create/', user.create);
app.get('/rest-services/user/get/:Email', user.get);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

const getAllChannels = require(__base + '/services/oplm-service').getAllChannels;

var toto = getAllChannels(require(__base + '/mock').getOplm);

