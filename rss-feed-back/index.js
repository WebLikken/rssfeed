'use strict';
global.__base = __dirname + '/';
require(__base + '/routes');
let AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG;
let dto = require(__base + 'dto-services/dto-service');
let oplmServices = require(__base + '/services/oplm-service');
let oplm = require(__base + '/mock').getOplm;

// Importation Oplm pour user boulerluc@gmail.ccm
oplmServices.importCategoriesAndChannels(oplm, 'a941c1b0-d548-11e7-b68b-2df884680a57');

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
