'use strict';

let parser = require("rss-parser");
let Channel = require(__base + 'model/Channel').Channel;
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
/*title, text, htmlUrl, type, xmlUrl*/
let createChannelClass = function (_channel) {
    let channel = new Channel();
    channel.title = _channel.title;
    channel.text = _channel.text;
    channel.htmlUrl = _channel.htmlUrl;
    channel.type = _channel.type;
    channel.xmlUrl = _channel.xmlUrl;
    return channel;
};

let createChannelsAndSave_P = function (IDUser, _channels) {
    return new Promise((resolve, reject) => {
        var channels = [], that = this;
        _channels.forEach(function(channel){
            channels.push(that.createChannelClass(IDUser, channel));
        });
        dtoCategory.batchWriteItem(categories, function (error, data) {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
} ;
exports.getFeedsFromChannel = getFeedsFromChannel;
exports.createChannelClass = createChannelClass;
