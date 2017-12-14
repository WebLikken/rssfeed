'use strict';
let channelService = require(__base + '/services/channel-service'),
    hash = require('object-hash'),
    hashKeys = ['title', 'published', 'author', 'link'],
    feedRead = require("feed-read"),
    Feed = require(__base + 'model/Feed').Feed,
    dto = require(__base + 'dto-services/dto-general-service'),
    AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG;

let getHashIDFeed = function (feed) {
    let o = {};
    hashKeys.forEach(function (property) {
        o[property] = feed[property];
    });
    return hash(o);
};
/*let createFeedObjectsAndSave_P = function () {
    let feeds = [];
    this.getAllFeeds_P().then(function (allFeeds) {
        allFeeds.forEach(function (feed) {
            if (!feed.error) {
                feeds.push(createFeedClass(feed));
            }
        });
    });
};*/
/**
 * Création et sauvegarde de channels
 * @param IDUser
 * @param _channels tableau de channel
 * @returns {Promise.<*[]>}
 */
let saveFeeds_P = function (_feeds) {
    let MAX_ITEMS = AWS_CONFIG.MAX_BATCH_WRITE,
        promises = [];

    for (let i = 0; i < Math.ceil(_feeds.length / MAX_ITEMS); i += 1) {
        let feeds = [];

        for (let j = i * MAX_ITEMS; j < (i + 1) * MAX_ITEMS && j < _feeds.length; j += 1) {
            feeds.push(_feeds[j]);
        }
        promises.push(new Promise((resolve, reject) => {

            dto.batchWriteItem(AWS_CONFIG.TABLE_FEED, feeds, function (error, data) {
                resolve({data: data, error: error});
            });
        }));
    }
    return Promise.all(promises);
};

let createFeedObjects_P = function (channel) {
    return new Promise(function (resolve) {
        getFeeds_P(channel).then(function (data) {
            let feeds = [];
            if (!data.error) {
                data.feeds.forEach(function (feed) {
                    feeds.push(createFeedClass(feed, data.channel.IDChannel));
                });
            }
            resolve({data: data, feeds: feeds, channel: channel});
        });
    });
};

let createFeedClass = function (feed, IDChannel) {
    return new Feed(
        IDChannel,
        feed.title,
        feed.content,
        feed.published,
        feed.author,
        feed.link,
        feed.feed);
};

let getFeeds_P = function (channel) {
    return new Promise((resolve) => {
        feedRead(channel.xmlUrl, function (error, data) {
            resolve({error: error, channel: channel, feeds: data});
        });
    });
};


exports.getHashIDFeed = getHashIDFeed;
exports.getFeeds_P = getFeeds_P;
exports.createFeedClass = createFeedClass;
exports.createFeedObjects_P = createFeedObjects_P;
exports.saveFeeds_P = saveFeeds_P;