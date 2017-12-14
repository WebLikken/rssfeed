'use strict';

let channelService = require(__base + '/services/channel-service');
let feedService = require(__base + '/services/feed-service');
let moteurRoule = function () {
    let feeds = [];
    channelService.getAllChannels_p().then(function (_allChannels) {
        //A suuprimer
        let allChannels = [];
        allChannels.push(_allChannels[0]);
        allChannels.push(_allChannels[1]);
        //A suuprimer


        let promises = [];
        allChannels.forEach(function (channel) {
            promises.push(new Promise(function (resolve) {
                feedService.createFeedObjects_P(channel).then(function (result) {
                    resolve(result);
                });
            }));
        });
        Promise.all(promises).then(function (retour) {
            let feeds = [];
            retour.forEach(function (channel) {
                channel.feeds.forEach(function (feed) {
                    feeds.push(feed);
                });
            });

            feedService.saveFeeds_P(feeds).then(function (response) {
                console.log(response);
            }, function (err) {
                console.log(err);
            });

        });
    });
};

exports.moteurRoule = moteurRoule;