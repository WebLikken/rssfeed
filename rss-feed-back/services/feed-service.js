'use strict';
let channelService = require(__base + '/services/channel-service');
let hash = require('object-hash');
let hashKeys = ['title', 'published', 'author', 'link'];
let feedRead = require("feed-read");
//let Feed = require(__base + 'model/Feed').Feed;
let Dto = require(__base + 'Dto-services/Dto-general-service');
let AWS_CONFIG = require(__base + '/config/Dto-config').AWS_CONFIG;
var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed


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
let saveFeeds_P = function (_feeds, ctx) {
    let MAX_ITEMS = AWS_CONFIG.MAX_BATCH_WRITE,
        promises = [];

    for (let i = 0; i < Math.ceil(_feeds.length / MAX_ITEMS); i += 1) {
        let feeds = [];

        for (let j = i * MAX_ITEMS; j < (i + 1) * MAX_ITEMS && j < _feeds.length; j += 1) {
            feeds.push(_feeds[j]);
        }
        promises.push(new Promise((resolve, reject) => {
            try {
                console.log('feed-service saveFeeds_P begin with ctx :', JSON.stringify(ctx));

                Dto.batchWriteItem(AWS_CONFIG.TABLE_FEED, feeds, function (error, data) {
                    if (error) {
                        console.log('feed-service saveFeeds_P erreur, ctx :', JSON.stringify(ctx));
                    }
                    resolve({data: data, error: error, ctx: ctx});
                });
            }
            catch (error) {
                console.log('feed-service saveFeeds_P erreur, error :', JSON.stringify(error));
                console.log('feed-service saveFeeds_P erreur, ctx :', JSON.stringify(ctx));

            }
            Dto.batchWriteItem(AWS_CONFIG.TABLE_FEED, feeds, function (error, data) {
                if (error) {
                    console.log('feed-service saveFeeds_P erreur, ctx :', JSON.stringify(ctx));
                }
                resolve({data: data, error: error, ctx: ctx});
            });
        }));
    }
    return Promise.all(promises);
};

let createFeedObjects_P = function (channel) {
    return new Promise(function (resolve) {
        readFeeds_P(channel).then(function (data) {
            let feeds = [];
            if (!data.error) {
                data.feeds.forEach(function (_feed) {
                    let feed = _feed;
                    // modification légère du timeStamp si existant
                    for (let i = 0; i < feeds.length; i += 1) {
                        let storedFeed = feeds[i];
                        if (storedFeed.published === feed.published.getTime()) {
                            feed.published = new Date(feed.published.getTime() + Math.round(Math.random() * 100));
                        }
                    }
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

let readFeeds_P = function (channel) {
    return new Promise((resolve, reject) => {

        let req = request(channel.xmlUrl),
            feedparser = new FeedParser({normalize: true, addmeta: false}),
            feeds = [];

        req.on('error', function (error) {
            reject(error);
        });

        req.on('response', function (res) {
            var stream = this; // `this` is `req`, which is a stream

            if (res.statusCode !== 200) {
                reject('Bad status code');
            }
            else {
                stream.pipe(feedparser);
            }
        });

        feedparser.on('error', function (error) {
            reject(error);
        });

        feedparser.on('readable', function () {
            let stream = this,
                meta = this.meta,
                item;

            while (item = stream.read()) {
                feeds.push(item);
                //resolve(item);
            }
            if (!item) {
                resolve({error: null, channel: channel, feeds: feeds});

            }
        });
    });
};
let getAllFeedsSorted_P = function (IDUser) {
    return new Promise((resolve, reject) => {
        channelService.getAllChannelsByUser_p(IDUser).then(
            function (allChannels) {
                let channel = '909b285b-df73-11e7-ab63-b18891cd65b8';


                let params = {
                    TableName: AWS_CONFIG.TABLE_FEED,
                    /*ProjectionExpression:"#yr, title, info.genres, info.actors[0]",*/
                    KeyConditionExpression: "#IDChannel = :IDChannel and published between :from and :to",
                    ExpressionAttributeNames: {
                        "#IDChannel": "IDChannel"
                    },
                    ExpressionAttributeValues: {
                        ":IDChannel": channel,
                        ":from": '1513177650999',
                        ":to": '1513177651001'
                    }
                };
                Dto.query(params).then(function (data) {
                    resolve(data);

                }, function (error) {
                    reject(error);

                });
            },
            function (error) {
                reject(error);
            });
    });
};

let getFeeds_P = function (channel) {
    return new Promise((resolve) => {
        feedRead(channel.xmlUrl, function (error, data) {
            resolve({error: error, channel: channel, feeds: data});
        });
    });
};

exports.getHashIDFeed = getHashIDFeed;
exports.readFeeds_P = readFeeds_P;
exports.createFeedClass = createFeedClass;
exports.createFeedObjects_P = createFeedObjects_P;
exports.saveFeeds_P = saveFeeds_P;
exports.getAllFeedsSorted_P = getAllFeedsSorted_P;
exports.getFeeds_P = getFeeds_P;