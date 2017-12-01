'use strict';

const hash = require('object-hash');

const hashKeys = ['title', 'published', 'author', 'link'];


exports.getHashIDFeed = function (feed) {
    let o = {};
    hashKeys.forEach(function (property) {
        o[property] = feed[property];
    });
    return hash(o);
};