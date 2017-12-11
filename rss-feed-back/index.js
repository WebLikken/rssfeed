'use strict';
global.__base = __dirname + '/';
//require(__base + '/routes');
let AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG;
let dto = require(__base + 'dto-services/dto-general-service');
let oplmServices = require(__base + '/services/oplm-service');
//let categoryServices = require(__base + '/services/category-service');
let channelServices = require(__base + '/services/channel-service');
let oplm = require(__base + '/mock').getOplm;
let smallOplm = require(__base + '/mock').getSmallOplm;
var feed = require("feed-read");
// Importation Oplm pour user boulerluc@gmail.ccm
oplmServices.importCategoriesAndChannels(oplm, 'a941c1b0-d548-11e7-b68b-2df884680a57');

// Récupération d'un channel
/*
let params1 = {
        "TableName": AWS_CONFIG.TABLE_CHANNEL,
        "Key": {
            "IDChannel": {
                "S": "68821d80-dcf7-11e7-aff5-33fb1b6a9039"
            }
        }
    },
    chanel = dto.getItem(params1, function (error, data) {
        console.log(JSON.stringify(data));
    });
*/

//et allcategories = oplmServices.getAllChannels(oplm);
//let categories = oplmServices.createCategories(oplm,'a941c1b0-d548-11e7-b68b-2df884680a57');


//oplmServices.createChannels(oplm,'a941c1b0-d548-11e7-b68b-2df884680a57');


/*
dto.query(AWS_CONFIG.TABLE_CATEGORY, 'a941c1b0-d548-11e7-b68b-2df884680a57', function (err, data) {
    console.log(err, data);
    if (err) {
        console.error(err)
    } else {
        oplmServices.createChannels(oplm, data.Items, 'a941c1b0-d548-11e7-b68b-2df884680a57');

    }
});
*/
/*var toot=categoryServices.getAllCategoriesByUSer('a941c1b0-d548-11e7-b68b-2df884680a57').then(
    function (data) {
        console.log(data);
    },
    function (error) {
        console.log(error);

    }
);*/


/*
channelServices.getAllChannels_p().then(function (channels) {
        let i = 0;

        function myFunc(arg) {
            console.log(arg);
            feed(channels[i].xmlUrl, function (error, data) {
                if(error){
                    console.log('Error : ',channels[i].xmlUrl);
                }
            });
            if (i < channels.length) {
                setTimeout(myFunc, 10, ++i);
            }
        }

        setTimeout(myFunc, 10, ++i);


    },

    function (error) {
        console.log(error);
    });*/
