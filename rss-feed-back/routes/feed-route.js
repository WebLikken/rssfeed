'use strict';

/*Mock pour la création de feed*/
const feeds = require(__base + '/mock').getFeeds;
const create = require(__base + '/rest-services/feed/create').create;

exports.feed = {
    create: function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(feeds[1]));
        create(feeds[2], function (error, response) {
            console.log('retour', response);
        });
    }
};