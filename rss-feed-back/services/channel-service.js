'use strict';

let parser = require("rss-parser"),
    Channel = require(__base + 'model/Channel').Channel,
    dto = require(__base + 'dto-services/dto-service'),
    AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG,

    getChanel = function (url, callBack) {
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
    let MAX_ITEMS = AWS_CONFIG.MAX_BATCH_WRITE,
        promises = [], that = this;

    for (let i = 0; i < Math.ceil(_channels.length / MAX_ITEMS); i += 1) {
        let channels = [];
            // TODO check if channel exist

        for (let j = i * MAX_ITEMS; j < (i + 1) * MAX_ITEMS && j < _channels.length; j += 1) {
            channels.push(that.createChannelClass(_channels[j]));
        }
        promises.push(new Promise((resolve, reject) => {

            dto.batchWriteItem(AWS_CONFIG.TABLE_CHANNEL, channels, function (error, data) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        }));
    }
    return Promise.all(promises);
};
exports.getFeedsFromChannel = getFeedsFromChannel;
exports.createChannelClass = createChannelClass;
exports.createChannelsAndSave_P = createChannelsAndSave_P;
