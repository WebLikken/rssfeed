'use strict';

const hash = require('object-hash');

const hashKeys = ['title', 'published', 'author', 'link'];


let getHashIDFeed = function (feed) {
    let o = {};
    hashKeys.forEach(function (property) {
        o[property] = feed[property];
    });
    return hash(o);
},
initFeedsOfNewChannel=function (IDChannel) {

};
exports.getHashIDFeed = getHashIDFeed;
exports.initFeedsOfNewChannel = initFeedsOfNewChannel;