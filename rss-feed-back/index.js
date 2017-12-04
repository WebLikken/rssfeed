'use strict';
global.__base = __dirname + '/';
require(__base + '/routes');
let dtoCategory = require(__base + 'dto-services/dto-category');
let oplmServices = require(__base + '/services/oplm-service');
let oplm = require(__base + '/mock').getOplm;

let categoriesAndChannels = oplmServices.importCategoriesAndChannels(oplm,'a941c1b0-d548-11e7-b68b-2df884680a57');
//et allcategories = oplmServices.getAllChannels(oplm);
//let categories = oplmServices.createCategories(oplm,'a941c1b0-d548-11e7-b68b-2df884680a57');


//oplmServices.createChannels(oplm,'a941c1b0-d548-11e7-b68b-2df884680a57');


/*
dtoCategory.query('a941c1b0-d548-11e7-b68b-2df884680a57', function (err, data) {
    console.log(err, data);
    if (err) {
        console.error(err)
    } else {
        oplmServices.createChannels(oplm, data.Items, 'a941c1b0-d548-11e7-b68b-2df884680a57');

    }
});*/
