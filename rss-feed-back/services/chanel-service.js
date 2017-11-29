'use strict';

let parser = require("rss-parser");

let getChanel = function (url, callBack) {
    parser.parseURL(url, callBack);

};
let getChannel = function (url) {
    return getChanel(url, function (err, result) {
        return result.feed;
    });
};

let getFeedsFromChannel = function (url) {
    return getChanel(url, function (err, result) {
        if (!err) return result.feed.entries;
    });
};
exports.getFeedsFromChannel = getFeedsFromChannel;
