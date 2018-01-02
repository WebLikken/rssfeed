'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    app = express();
app.use(bodyParser.json());

/*Mock pour la création de feed*/
const feeds = require(__base + '/mock').getFeeds;

const create = require(__base + '/rest-services/feed/create').create;
let feed = {
    create: function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(feeds[1]));
        create(feeds[2], function (error, response) {
            console.log('retour', response);
        });
    }
};
let user = {
    create: function (req, res) {
        let createUserService = require(__base + '/services/user-service').create,
            newUser;

        if (req.body && req.body.Email) {
            newUser = createUserService(req.body.Email);
        }

        const createUser = require(__base + '/rest-services/user/create').create;

        createUser(newUser, function (error, response) {
            var resp;
            if (error) {
                resp = error;
            } else {
                resp = response;
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resp));
        });
    },
    get: function () {
    }
};

app.post('/rest-services/feed/create/', feed.create);
app.post('/rest-services/user/create/', user.create);
// Url : http://localhost:3000/rest-services/user/get/email=123
app.get('/rest-services/user/get/:IDUser/:Email', function(req, res, next) {
    const get = require(__base + '/rest-services/user/get').get;
    get(req.params, function (error, response) {
        console.log(response);
    });

});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

