'use strict';

let parser = require("rss-parser"),
    Channel = require(__base + 'model/Channel').Channel,
    dto = require(__base + 'dto-services/dto-general-service'),
    AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG,

    getChanel = function (url, callBack) {
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

            dto.batchWriteItem(AWS_CONFIG.TABLE_CHANNEL, channels, function (error, data) {
                    resolve({data:data, error:error});
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
        dto.scan(params).then(function (channels) {
            resolve(channels);
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