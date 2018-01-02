'use strict';
exports.user = {
    create: function (req, res) {
        let createUserService = require(__base + '/services/user-service').create,
            newUser;

        if (req.body && req.body.Email) {
            newUser = createUserService(req.body.Email);
        }

        const createUser = require(__base + '/rest-services/user/create').create;

        createUser(newUser, function (error, response) {
            let resp;
            if (error) {
                resp = error;
            } else {
                resp = response;
            }
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resp));
        });
    },
    get: function (req, res, next) {
        const get = require(__base + '/rest-services/user/get').get;
        get(req.params, function (error, response) {
            console.log(response);
        });
    }
};
