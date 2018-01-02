'use strict';
global.__base = __dirname + '/';
//require(__base + '/routes');
let AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG;
let dto = require(__base + 'dto-services/dto-general-service');
let dtoFeedService = require(__base + 'dto-services/dto-feed-service');
let dtoCategoryService = require(__base + 'dto-services/dto-category-service');
let dtoChannelService = require(__base + 'dto-services/dto-channel-service');
let oplmServices = require(__base + '/services/oplm-service');
//let categoryServices = require(__base + '/services/category-service');
let feedServices = require(__base + '/services/feed-service');
let UserServices = require(__base + '/services/user-service');
let channelServices = require(__base + '/services/channel-service');
let moteurServices = require(__base + '/services/moteur-service');
let oplm = require(__base + '/mock').getOplm;
let feed = require("feed-read");

/*let opts = {
    errorEventName:'error',
    logDirectory:'C:/Users/LBO14/dev/rssfeed/rss-feed-back/traces', // NOTE: folder must exist and be writable...
    fileNamePattern:'roll-<DATE>.log',
    dateFormat:'YYYY.MM.DD'
};*/
//global.log = require('simple-node-logger').createRollingFileLogger( opts );
//log.setLevel('error');
// Importation Oplm pour user boulerluc@gmail.ccm


// RAZ DB


/*dtoFeedService.deleteTable_P().then(function () {
    dto.waitingStatusTableActive('Feed').then(function (data) {
        console.log(data);
        dtoFeedService.createTable_P().then(function () {
            dto.waitingStatusTableActive('Feed').then(function (data) {
                console.log(data);
                dtoCategoryService.deleteTable_P().then(function () {
                    dto.waitingStatusTableActive('Category').then(function (data) {
                        console.log(data);
                        dtoCategoryService.createTable_P().then(function () {
                            dto.waitingStatusTableActive('Category').then(function (data) {
                                console.log(data);
                                dtoChannelService.deleteTable_P().then(function () {
                                    dto.waitingStatusTableActive('Channel').then(function (data) {
                                        console.log(data);
                                        dtoChannelService.createTable_P().then(function () {
                                            dto.waitingStatusTableActive('Channel').then(function (data) {
                                                oplmServices.importCategoriesAndChannels_p(oplm, 'a941c1b0-d548-11e7-b68b-2df884680a57')
    .then(function () {
        moteurServices.moteurRoule();

    }, function (error) {
        console.log(error);
    });

                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});*/




feedServices.readFeeds_P({xmlUrl: 'http://www.journaldunet.com/media/rss/'}).then(function (data) {
    console.log(data);
}, function (error) {
    console.log(error);
});