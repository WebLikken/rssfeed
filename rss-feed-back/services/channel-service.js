'use strict';

let parser = require("rss-parser");
let Channel = require(__base + 'model/Channel').Channel;
let Dto = require(__base + 'dto-services/dto-general-service');
let CategoryService = require(__base + 'services/category-service');
let FeedService = require(__base + 'services/feed-service');
let AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG;
let AWS = require('aws-sdk');
let dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient();
let dynamoDb = new AWS.DynamoDB();

let getChanel = function (url, callBack) {
    parser.parseURL(url, callBack);
};
/*let getChannel = function (url) {
    return getChanel(url, function (err, result) {
        return result.feed;
    });
};*/

let getFeedsFromChannel = function (url) {
    return getChanel(url, function (err, result) {
        if (!err) return result.feed.entries;
    });
};
/**
 * Création objet Classe
 * @param _channel
 * @returns {Pinpoint.SetDimension | Channel}
 */
let createChannelClass = function (_channel) {
    let channel = new Channel();
    channel.title = _channel.title;
    channel.text = _channel.text;
    channel.htmlUrl = _channel.htmlUrl;
    channel.type = _channel.type;
    channel.xmlUrl = _channel.xmlUrl;
    return channel;
};
/**
 *  Check si channel  présent dans le tableau
 * @param _channel
 * @param allChannels
 * @returns {object or undefined}
 */
let getChannelIfExists = function (_channel, allChannels) {
    let propertiesToCkeck = ['xmlUrl'], i;

    for (i = 0; i < allChannels.length; i += 1) {
        let channel = allChannels[i], exist;
        for (let j = 0; j < propertiesToCkeck.length; j += 1) {
            let prop = propertiesToCkeck[j],
                check = channel[prop] === _channel[prop];
            exist = typeof exist === 'undefined' ? check : exist && check;
        }
        if (exist) {
            return allChannels[i];
        }
    }
};
/**
 * Création et sauvegarde de channels
 * @param IDUser
 * @param _channels tableau de channel
 * @returns {Promise.<*[]>}
 */
let saveChannels_P = function (IDUser, _channels) {
    let MAX_ITEMS = AWS_CONFIG.MAX_BATCH_WRITE,
        promises = [], that = this;

    for (let i = 0; i < Math.ceil(_channels.length / MAX_ITEMS); i += 1) {
        let channels = [];

        for (let j = i * MAX_ITEMS; j < (i + 1) * MAX_ITEMS && j < _channels.length; j += 1) {
            channels.push(_channels[j]);
        }
        promises.push(new Promise((resolve, reject) => {

            Dto.batchWriteItem(AWS_CONFIG.TABLE_CHANNEL, channels, function (error, data) {
                resolve({data: data, error: error});
            });
        }));
    }
    return Promise.all(promises);
};
/**
 * Récupère la totalité des channels
 * @returns {Promise}
 */
let getAllChannels_p = function () {
    return new Promise((resolve, reject) => {
        let params = {
            TableName: AWS_CONFIG.TABLE_CHANNEL
        };
        Dto.scan(params).then(function (channels) {
            resolve(channels);
        }, function (erreur) {
            reject(erreur);
        });
    });
};
let getAllChannelsByUser_p = function (IDUser) {
    return new Promise((resolve, reject) => {
        let categories = CategoryService.getAllCategoriesByUSer_P(IDUser).then(
            function (categories) {
                let allChannels = [];
                categories.forEach(function (category) {
                    category.channels.values.forEach(function (channel) {
                        allChannels.push(channel);
                    });
                });
                resolve(allChannels);
            },
            function (error) {
                reject(error);
            });
    });
};
let createChannelFeedsPublishedDate_P = function (_channel) {
    return new Promise((resolve, reject) => {

        let channel = {
            IDChannel: '5f163307-e362-11e7-8233-adb7ddae34f8'
        };
        channel.publishedFeed = [];
        let params = {
            TableName: AWS_CONFIG.TABLE_FEED,
            KeyConditionExpression: "#IDChannel = :IDChannel",
            ExpressionAttributeNames: {
                "#IDChannel": "IDChannel"
            },
            ExpressionAttributeValues: {
                ":IDChannel": channel.IDChannel
            }
        };
        Dto.query(params).then(function (channels) {
            channels.Items.forEach(function (feed) {
                channel.publishedFeed.push(feed.published);
            });
            let params = {
                ExpressionAttributeValues: {
                    ":PF": dynamoDbDocumentClient.createSet(channel.publishedFeed),
                },
                Key: {
                    "IDChannel": channel.IDChannel
                },
                ReturnValues: "ALL_NEW",
                TableName: AWS_CONFIG.TABLE_CHANNEL,
                UpdateExpression: "ADD publishedFeed :PF"
            };
            Dto.update(params, function (error, data) {
                if (!error) {
                    resolve(data);
                } else {
                    reject(error);
                }
            });


        }, function (erreur) {
            reject(erreur);
        });
    });
};
exports.getFeedsFromChannel = getFeedsFromChannel;
exports.createChannelClass = createChannelClass;
exports.saveChannels_P = saveChannels_P;
exports.getAllChannels_p = getAllChannels_p;
exports.getChannelIfExists = getChannelIfExists;
exports.getChanel = getChanel;
exports.getAllChannelsByUser_p = getAllChannelsByUser_p;
exports.createChannelFeedsPublishedDate_P = createChannelFeedsPublishedDate_P;
