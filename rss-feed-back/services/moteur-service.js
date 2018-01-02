'use strict';

let channelService = require(__base + '/services/channel-service');
let feedService = require(__base + '/services/feed-service');

let moteurRoule, saveFeedsForChannel_p;
moteurRoule = function () {
    channelService.getAllChannels_p().then(
        function (allChannels) {
            let promises = [];
            console.log(allChannels.length);
            allChannels.forEach(function (channel) {
                promises.push(saveFeedsForChannel_p(channel));
            });
            Promise.all(promises).then(
                function (retour) {
                    console.log(retour);
                }, function (error) {
                    console.log(error);
                });
        });
};
saveFeedsForChannel_p = function (channel) {
    return new Promise(function (resolve, reject) {
        feedService.createFeedObjects_P(channel).then(
            function (result) {
                console.log('moteur-service - saveFeedsForChannel_p', JSON.stringify(channel));
                feedService.saveFeeds_P(result.feeds, channel).then(
                    function (response) {
                        resolve(response);
                        console.log(response);
                    });
            },
            function (err) {
                console.log(err);
                reject(err);
            });
    });
};
exports.moteurRoule = moteurRoule;